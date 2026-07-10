// Pyodide 워커의 메인 스레드 클라이언트.
// 워커를 싱글톤으로 재사용하다가, 타임아웃이 나면 terminate()로 죽이고 핸들을 폐기한다.
// 다음 호출에서 새 워커를 lazy 생성하므로 Pyodide가 재로드된다(= 무한루프로부터 복구).
//
// 모든 실행은 단일 큐로 직렬화한다. 덕분에 워커 내부 전역(__user_code__ 등)이 동시
// 실행으로 덮어써지지 않고, 타임아웃 시 terminate가 진행 중인 다른 실행을 깨뜨리지도 않는다.
// 또한 워커를 새로 만들면 Pyodide warm(수 초)이 끝난 뒤에야 사용자 코드 타임아웃 타이머를
// 시작하므로, 한 케이스의 타임아웃이 콜드 로드 때문에 이후 케이스로 연쇄 전파되지 않는다.
//
// 큐는 모듈 전역이라, 채점 도중 화면을 떠나면 남은 케이스가 계속 돌며 다음 화면의 실행을
// 뒤에 줄 세운다. discardWorker()가 세대를 올려 구세대 실행을 cancelled 로 매듭짓고 큐를 비운다.

export type RunResult =
  | { status: "ok"; stdout: string }
  | { status: "error"; message: string }
  | { status: "timeout" }
  | { status: "cancelled" };

/** 사용자 코드가 아니라 채점기(Pyodide) 자체를 띄우지 못한 경우. */
export class PythonRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PythonRuntimeError";
  }
}

type WorkerResponse =
  | { type: "warmed" }
  | { type: "warm-failed"; message: string }
  | { type: "result"; id: number; ok: boolean; stdout: string; stderr: string };

// Pyodide 콜드 로드 상한. 이걸 넘기면 채점기를 띄우지 못한 것으로 본다.
const WARM_TIMEOUT_MS = 30000;

let worker: Worker | null = null;
let warmPromise: Promise<void> | null = null;
// 진행 중인 warm 을 중단한다. 타이머·리스너를 걷어내는 것만으로는 부족하다 —
// warmPromise 를 await 하던 호출자가 영원히 멈추므로 반드시 reject 까지 해야 한다.
let abortWarm: ((reason: Error) => void) | null = null;
let sequence = 0;
let generation = 0;
let queue: Promise<unknown> = Promise.resolve();

// 진행 중인 실행을 cancelled 로 즉시 매듭짓는 콜백들.
const pendingCancels = new Set<() => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url));
    warmPromise = null; // 새 워커는 아직 콜드 상태.
  }
  return worker;
}

// Pyodide가 완전히 로드될 때까지 대기한다. 같은 워커에 대해선 단일 promise를 공유한다.
// warm 실패는 반드시 reject 로 새어나와야 한다 — 아니면 호출자가 영원히 멈춘다.
function warmWorker(activeWorker: Worker): Promise<void> {
  if (warmPromise) return warmPromise;

  warmPromise = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new PythonRuntimeError("채점기를 불러오는 데 너무 오래 걸려요."));
    }, WARM_TIMEOUT_MS);

    function onMessage(event: MessageEvent<WorkerResponse>) {
      if (event.data.type === "warmed") {
        cleanup();
        resolve();
        return;
      }
      if (event.data.type === "warm-failed") {
        cleanup();
        reject(new PythonRuntimeError("채점기를 불러오지 못했어요."));
      }
    }

    // 워커 스크립트 자체가 뜨지 못한 경우.
    function onError() {
      cleanup();
      reject(new PythonRuntimeError("채점기를 불러오지 못했어요."));
    }

    function cleanup() {
      clearTimeout(timer);
      activeWorker.removeEventListener("message", onMessage);
      activeWorker.removeEventListener("error", onError);
      if (abortWarm === abort) abortWarm = null;
    }

    function abort(reason: Error) {
      cleanup();
      reject(reason);
    }

    abortWarm = abort;
    activeWorker.addEventListener("message", onMessage);
    activeWorker.addEventListener("error", onError);
    activeWorker.postMessage({ type: "warm" });
  });
  return warmPromise;
}

/** 에디터 마운트 시점에 호출해 Pyodide 로드(수 초)를 첫 실행 전에 끝내 둔다. */
export function warmRuntime(): void {
  // 실패는 여기서 삼킨다. 실제 실행 때 runPython 이 다시 만나 호출자에게 알린다.
  void warmWorker(getWorker()).catch(() => {});
}

/**
 * 워커를 폐기하고 진행 중인 실행을 모두 취소한다.
 * 화면 이탈 시 큐 오염을 막고, 채점기 로드 실패 후 재시도할 때 죽은 런타임을 버린다.
 * 워커의 runtimePromise 는 거부된 promise 도 캐시하므로, 재시도하려면 워커 자체를 새로 만들어야 한다.
 */
export function discardWorker(): void {
  worker?.terminate();
  worker = null;

  // 세대를 먼저 올린다. 그래야 warm 을 기다리던 runOnce 가 아래 reject 를 받고
  // 에러가 아니라 cancelled 로 매듭짓는다.
  generation += 1;

  // 진행 중이던 warm 의 타이머·리스너를 걷어내고 대기자를 즉시 풀어 준다.
  abortWarm?.(new PythonRuntimeError("채점기 로드가 취소되었어요."));
  abortWarm = null;
  warmPromise = null;

  for (const cancel of pendingCancels) cancel();
  pendingCancels.clear();

  queue = Promise.resolve();
}

export function runPython(code: string, stdin: string, timeoutMs: number): Promise<RunResult> {
  // 세대는 호출 시점에 고정한다. 큐에서 대기하는 동안 폐기되면 실행하지 않고 취소로 끝낸다.
  const requestGeneration = generation;
  // 큐에 이어 붙여 한 번에 한 실행만 워커로 보낸다. 앞 실행이 실패해도 큐는 끊기지 않는다.
  const task = queue.then(() => runOnce(requestGeneration, code, stdin, timeoutMs));
  queue = task.catch(() => {});
  return task;
}

async function runOnce(
  requestGeneration: number,
  code: string,
  stdin: string,
  timeoutMs: number,
): Promise<RunResult> {
  if (requestGeneration !== generation) return { status: "cancelled" };

  const activeWorker = getWorker();

  // 콜드 로드 시간이 timeoutMs에 포함되지 않도록 warm 이후에 타이머를 건다.
  try {
    await warmWorker(activeWorker);
  } catch (error) {
    if (requestGeneration !== generation) return { status: "cancelled" };
    throw error;
  }

  if (requestGeneration !== generation) return { status: "cancelled" };

  return execute(activeWorker, code, stdin, timeoutMs);
}

function execute(
  activeWorker: Worker,
  code: string,
  stdin: string,
  timeoutMs: number,
): Promise<RunResult> {
  const id = ++sequence;

  return new Promise<RunResult>((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      finish();
      activeWorker.terminate();
      // 폐기 — 다음 runPython/warmRuntime 이 새 워커를 만든다.
      if (worker === activeWorker) {
        worker = null;
        warmPromise = null;
      }
      resolve({ status: "timeout" });
    }, timeoutMs);

    function cancel() {
      if (settled) return;
      finish();
      resolve({ status: "cancelled" });
    }

    function finish() {
      settled = true;
      clearTimeout(timer);
      activeWorker.removeEventListener("message", onMessage);
      pendingCancels.delete(cancel);
    }

    function onMessage(event: MessageEvent<WorkerResponse>) {
      const data = event.data;
      if (data.type !== "result" || data.id !== id) return;
      if (settled) return;
      finish();
      resolve(
        data.ok ? { status: "ok", stdout: data.stdout } : { status: "error", message: data.stderr },
      );
    }

    pendingCancels.add(cancel);
    activeWorker.addEventListener("message", onMessage);
    activeWorker.postMessage({ type: "run", id, code, stdin });
  });
}
