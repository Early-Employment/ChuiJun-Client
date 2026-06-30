const categoryStats = [
  { label: "그리디 알고리즘", solved: 82, failed: 18 },
  { label: "해시", solved: 72, failed: 10 },
  { label: "정렬", solved: 58, failed: 18 },
  { label: "DFS BFS", solved: 43, failed: 14 },
  { label: "동적 계획법", solved: 32, failed: 12 },
];

export function CategorySolveStatusCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg font-semibold">분야 별 정답/풀이 현황</h2>
      <div className="mt-7 flex h-36 items-start gap-2 sm:gap-3">
        {categoryStats.map((category, index) => (
          <div key={`${category.label}-${index}`} className="flex flex-1 flex-col items-center">
            <div className="flex h-28 w-full flex-col justify-end rounded-sm bg-neutral-200">
              <div className="bg-accent rounded-sm" style={{ height: `${category.solved}%` }} />
            </div>
            <span className="mt-2 text-center text-xs leading-tight">
              {category.label.split(" ").map((word, wordIndex, words) => (
                <span key={wordIndex}>
                  {word}
                  {wordIndex < words.length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="text-foreground mt-3 flex gap-5 text-xs font-medium">
        <span className="flex items-center gap-1">
          <span className="bg-accent size-2 rounded-full" />
          맞은 문제
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-neutral-200" />
          틀린 문제
        </span>
      </div>
    </section>
  );
}
