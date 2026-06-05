/// <reference lib="webworker" />

// Pyodide(WASM CPython)를 CDN에서 lazy-load 해 사용자 파이썬 코드를 실행하는 Web Worker.
// 무한루프 대응은 메인 스레드(python-runner.ts)가 worker.terminate()로 처리하므로,
// 이 워커는 단일 실행에만 집중한다. stdlib만 사용한다.

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full";

declare function loadPyodide(config: { indexURL: string }): Promise<PyodideRuntime>;

interface PyProxy {
  toJs(): [string, string | null];
  destroy(): void;
}

interface PyodideRuntime {
  globals: { set(name: string, value: unknown): void };
  runPythonAsync(code: string): Promise<PyProxy>;
}

// stdin 주입 + stdout 캡처. 사용자 코드는 격리된 globals 딕셔너리에서 exec 되어
// 실행 간 전역이 새지 않는다. 예외는 traceback 문자열로 회수한다.
const RUN_WRAPPER = `
import sys, io, traceback

sys.stdin = io.StringIO(__user_stdin__)
_buf = io.StringIO()
sys.stdout = _buf
_err = None
try:
    exec(__user_code__, {"__name__": "__main__"})
except BaseException:
    _err = traceback.format_exc()
finally:
    sys.stdin = sys.__stdin__
    sys.stdout = sys.__stdout__

(_buf.getvalue(), _err)
`;

let runtimePromise: Promise<PyodideRuntime> | null = null;

function getRuntime(): Promise<PyodideRuntime> {
  if (!runtimePromise) {
    importScripts(`${PYODIDE_CDN}/pyodide.js`);
    runtimePromise = loadPyodide({ indexURL: `${PYODIDE_CDN}/` });
  }
  return runtimePromise;
}

type WorkerRequest = { type: "warm" } | { type: "run"; id: number; code: string; stdin: string };

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;

  if (message.type === "warm") {
    await getRuntime();
    self.postMessage({ type: "warmed" });
    return;
  }

  const { id, code, stdin } = message;
  try {
    const pyodide = await getRuntime();
    pyodide.globals.set("__user_code__", code);
    pyodide.globals.set("__user_stdin__", stdin);

    const result = await pyodide.runPythonAsync(RUN_WRAPPER);
    const [stdout, err] = result.toJs();
    result.destroy();

    self.postMessage({ type: "result", id, ok: err === null, stdout, stderr: err ?? "" });
  } catch (error) {
    // Pyodide 로드 실패 등 파이썬 레벨 밖의 오류.
    self.postMessage({ type: "result", id, ok: false, stdout: "", stderr: String(error) });
  }
};
