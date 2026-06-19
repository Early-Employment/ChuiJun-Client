"use client";

import { useEffect } from "react";
import { warmRuntime } from "@/shared/lib/pyodide/python-runner";

/** 컴포넌트 마운트 시 Pyodide 워커를 미리 띄워 첫 실행 지연을 가린다. */
export function useWarmPythonRuntime(): void {
  useEffect(() => {
    warmRuntime();
  }, []);
}
