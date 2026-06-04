export function ClassGroupCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg font-semibold">소속 그룹</h2>
      <div className="bg-surface-subtle mt-5 flex flex-col items-center rounded-lg px-6 py-8 sm:px-10">
        <strong className="text-heading">3학년 1반</strong>
        <span className="text-muted mt-2 text-sm">알고리즘 수업</span>
      </div>
    </section>
  );
}
