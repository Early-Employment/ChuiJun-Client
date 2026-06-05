// Pyodide 워커의 메인 스레드 클라이언트.
// 워커를 싱글톤으로 재사용하다가, 타임아웃이 나면 terminate()로 죽이고 핸들을 폐기한다.
// 다음 호출에서 새 워커를 lazy 생성하므로 Pyodide가 재로드된다(= 무한루프로부터 복구).

export type RunResult =
  | { status: "ok"; stdout: string }
  | { status: "error"; message: string }
  | { status: "timeout" };

type WorkerResponse =
  | { type: "warmed" }
  | { type: "result"; id: number; ok: boolean; stdout: string; stderr: string };

let worker: Worker | null = null;
let sequence = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url));
  }
  return worker;
}

/** 에디터 마운트 시점에 호출해 Pyodide 로드(수 초)를 첫 실행 전에 끝내 둔다. */
export function warmRuntime(): void {
  getWorker().postMessage({ type: "warm" });
}

export function runPython(code: string, stdin: string, timeoutMs: number): Promise<RunResult> {
  const activeWorker = getWorker();
  const id = ++sequence;

  return new Promise<RunResult>((resolve) => {
    const timer = setTimeout(() => {
      cleanup();
      activeWorker.terminate();
      worker = null; // 폐기 — 다음 runPython/warmRuntime이 새 워커를 만든다.
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
