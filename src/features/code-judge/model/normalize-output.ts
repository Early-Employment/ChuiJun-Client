// 백준 채점 관례에 따른 stdout 정규화: 각 줄의 우측 공백 제거 + 말미 개행 제거.
// 출력이 기대값과 trailing whitespace만 다를 때 오답 처리되는 것을 막는다.
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}
