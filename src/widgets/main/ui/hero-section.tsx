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
          <article className="flex min-h-56 flex-col justify-start rounded-lg bg-surface px-8 py-7 shadow-sm lg:min-h-64 lg:px-10 lg:py-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-[44px]">
              안녕하세요
            </h1>
            <p className="mt-6 text-xl font-semibold text-foreground lg:text-2xl">
              잘왔어요. 여기가 짱짱 좋음
            </p>
          </article>

          <aside className="self-start rounded-lg bg-surface p-3 shadow-sm">
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
    <article
      className={`relative rounded-md bg-primary-50 p-3 text-foreground${className ? ` ${className}` : ""}`}
    >
      <p className="text-caption font-semibold text-accent-strong">{eyebrow}</p>
      <div className="mt-1.5 flex items-start justify-between gap-2.5">
        <div>
          <h2 className="text-body font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-label text-muted">{meta}</p>
        </div>
        <span className="pt-0.5 text-xl leading-none text-accent-strong">›</span>
      </div>
    </article>
  );
}
