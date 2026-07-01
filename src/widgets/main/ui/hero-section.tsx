export function HeroSection() {
  return (
    <section className="bg-accent">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-4 py-4 sm:px-6 lg:py-5 xl:px-8">
        <article className="bg-surface flex min-h-56 flex-col justify-start rounded-lg px-8 py-7 lg:min-h-64 lg:px-10 lg:py-8">
          <h1 className="text-foreground text-4xl font-extrabold tracking-tight lg:text-[44px]">
            안녕하세요
          </h1>
          <p className="text-foreground mt-6 text-xl font-semibold lg:text-2xl">
            잘왔어요. 여기가 짱짱 좋음
          </p>
        </article>
      </div>
    </section>
  );
}
