const summaryCards = [
  {
    eyebrow: "오늘의 문제",
    title: "서현이의 이준건 전화번호 구하기",
    meta: "그리디",
  },
  {
    eyebrow: "최신 문제",
    title: "이준건의 서현 전번 구하기 2",
    meta: "그리디",
  },
  {
    eyebrow: "나의 실시간 순위",
    title: "1위",
    meta: "종합 랭킹",
  },
  {
    eyebrow: "이어서 풀기",
    title: "서현이의 이준건 전화번호 구하기",
    meta: "그리디",
  },
] as const;

export function HeroSection() {
  return (
    <section className="bg-primary-500">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-4 py-4 sm:px-6 lg:py-5 xl:px-8">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <article className="bg-surface flex min-h-56 flex-col justify-start rounded-lg px-8 py-7 shadow-sm lg:min-h-64 lg:px-10 lg:py-8">
            <h1 className="text-foreground text-4xl font-extrabold tracking-tight lg:text-[44px]">
              안녕하세요
            </h1>
            <p className="text-foreground mt-6 text-xl font-semibold lg:text-2xl">
              잘왔어요. 여기가 짱짱 좋음
            </p>
          </article>

          <aside className="bg-surface self-start rounded-lg p-3 shadow-sm">
            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-2">
              {summaryCards.map((card, index) => (
                <SummaryCard
                  key={`${card.eyebrow}-${index}`}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  meta={card.meta}
                  className={index === 0 || index === 3 ? "md:col-span-2 xl:col-span-2" : ""}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  eyebrow,
  title,
  meta,
  className,
}: {
  eyebrow: string;
  title: string;
  meta: string;
  className?: string;
}) {
  return (
    <article className={`bg-primary-50 text-foreground relative rounded-md p-3 ${className}`}>
      <p className="text-caption text-accent-strong font-semibold">{eyebrow}</p>
      <div className="mt-1.5 flex items-start justify-between gap-2.5">
        <div>
          <h2 className="text-body text-foreground font-bold">{title}</h2>
          <p className="text-label text-muted mt-1">{meta}</p>
        </div>
        <span className="text-accent-strong pt-0.5 text-xl leading-none">›</span>
      </div>
    </article>
  );
}
