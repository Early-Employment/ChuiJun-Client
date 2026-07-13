// Pyodide(WASM CPython)를 CDN에서 lazy-load 해 사용자 파이썬 코드를 실행하는 Web Worker.
// 무한루프 대응은 메인 스레드(python-runner.ts)가 worker.terminate()로 처리하므로,
// 이 워커는 단일 실행에만 집중한다. stdlib만 사용한다.

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full";

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

let runtimePromise = null;

function getRuntime() {
  if (!runtimePromise) {
    importScripts(`${PYODIDE_CDN}/pyodide.js`);
    runtimePromise = loadPyodide({ indexURL: `${PYODIDE_CDN}/` });
  }
  return runtimePromise;
}

self.onmessage = async (event) => {
  const message = event.data;

  if (message.type === "warm") {
    try {
      await getRuntime();
    } catch (error) {
      // CDN 차단·오프라인 등. 이걸 알리지 않으면 메인 스레드가 warmed 를 영원히 기다린다.
      self.postMessage({ type: "warm-failed", message: String(error) });
      return;
    }
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

    // Pyodide는 Python의 None 을 JS null 이 아니라 undefined 로 변환한다.
    // 따라서 정상 실행(_err is None)은 err == null 로 판별해야 한다.
    self.postMessage({ type: "result", id, ok: err == null, stdout, stderr: err ?? "" });
  } catch (error) {
    // Pyodide 로드 실패 등 파이썬 레벨 밖의 오류.
    self.postMessage({ type: "result", id, ok: false, stdout: "", stderr: String(error) });
  }
};
