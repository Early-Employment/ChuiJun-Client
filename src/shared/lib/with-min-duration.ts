function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Pyodide 로컬 실행처럼 네트워크를 안 타 순식간에 끝나는 작업에 최소 대기 시간을 준다.
 * 너무 빨리 끝나면 로딩 스피너→결과 스태거로 이어지는 전환이 체감되지 않기 때문.
 * 실패(reject)는 최소 시간을 기다리지 않고 즉시 전파된다.
 */
export async function withMinDuration<T>(promise: Promise<T>, ms: number): Promise<T> {
  const [result] = await Promise.all([promise, delay(ms)]);
  return result;
}
