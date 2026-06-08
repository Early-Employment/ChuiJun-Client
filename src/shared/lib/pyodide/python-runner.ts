// Pyodide 워커의 메인 스레드 클라이언트.
// 워커를 싱글톤으로 재사용하다가, 타임아웃이 나면 terminate()로 죽이고 핸들을 폐기한다.
// 다음 호출에서 새 워커를 lazy 생성하므로 Pyodide가 재로드된다(= 무한루프로부터 복구).
//
// 모든 실행은 단일 큐로 직렬화한다. 덕분에 워커 내부 전역(__user_code__ 등)이 동시
// 실행으로 덮어써지지 않고, 타임아웃 시 terminate가 진행 중인 다른 실행을 깨뜨리지도 않는다.
// 또한 워커를 새로 만들면 Pyodide warm(수 초)이 끝난 뒤에야 사용자 코드 타임아웃 타이머를
// 시작하므로, 한 케이스의 타임아웃이 콜드 로드 때문에 이후 케이스로 연쇄 전파되지 않는다.

export type RunResult =
  | { status: "ok"; stdout: string }
  | { status: "error"; message: string }
  | { status: "timeout" };

type WorkerResponse =
  | { type: "warmed" }
  | { type: "result"; id: number; ok: boolean; stdout: string; stderr: string };

let worker: Worker | null = null;
let warmPromise: Promise<void> | null = null;
let sequence = 0;
let queue: Promise<unknown> = Promise.resolve();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url));
    warmPromise = null; // 새 워커는 아직 콜드 상태.
  }
  return worker;
}

// Pyodide가 완전히 로드될 때까지 대기한다. 같은 워커에 대해선 단일 promise를 공유한다.
function warmWorker(activeWorker: Worker): Promise<void> {
  if (warmPromise) return warmPromise;

  warmPromise = new Promise<void>((resolve) => {
    function onWarmed(event: MessageEvent<WorkerResponse>) {
      if (event.data.type !== "warmed") return;
      activeWorker.removeEventListener("message", onWarmed);
      resolve();
    }
    activeWorker.addEventListener("message", onWarmed);
    activeWorker.postMessage({ type: "warm" });
  });
  return warmPromise;
}

/** 에디터 마운트 시점에 호출해 Pyodide 로드(수 초)를 첫 실행 전에 끝내 둔다. */
export function warmRuntime(): void {
  warmWorker(getWorker());
}

export function runPython(code: string, stdin: string, timeoutMs: number): Promise<RunResult> {
  // 큐에 이어 붙여 한 번에 한 실행만 워커로 보낸다. 앞 실행이 실패해도 큐는 끊기지 않는다.
  const task = queue.then(() => runOnce(code, stdin, timeoutMs));
  queue = task.catch(() => {});
  return task;
}

async function runOnce(code: string, stdin: string, timeoutMs: number): Promise<RunResult> {
  const activeWorker = getWorker();
  // 콜드 로드 시간이 timeoutMs에 포함되지 않도록 warm 이후에 타이머를 건다.
  await warmWorker(activeWorker);
  const id = ++sequence;

  return new Promise<RunResult>((resolve) => {
    const timer = setTimeout(() => {
      cleanup();
      activeWorker.terminate();
      worker = null; // 폐기 — 다음 runPython/warmRuntime이 새 워커를 만든다.
      warmPromise = null;
      resolve({ status: "timeout" });
    }, timeoutMs);

    function onMessage(event: MessageEvent<WorkerResponse>) {
      const data = event.data;
      if (data.type !== "result" || data.id !== id) return;
      cleanup();
      resolve(
        data.ok ? { status: "ok", stdout: data.stdout } : { status: "error", message: data.stderr },
      );
    }

    function cleanup() {
      clearTimeout(timer);
      activeWorker.removeEventListener("message", onMessage);
    }

    activeWorker.addEventListener("message", onMessage);
    activeWorker.postMessage({ type: "run", id, code, stdin });
  });
}
