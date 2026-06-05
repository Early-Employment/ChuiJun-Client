import { runPython, type RunResult } from "@/shared/lib/pyodide/python-runner";

/** 채점과 분리된 자유 실행. 에디터의 stdin 입력값을 그대로 주입해 한 번 돌린다. */
export function runCode(code: string, stdin: string, timeoutMs = 3000): Promise<RunResult> {
  return runPython(code, stdin, timeoutMs);
}
