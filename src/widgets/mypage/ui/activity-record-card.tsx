const activityLevels = [
  3, 4, 2, 1, 5, 3, 0, 2, 4, 1, 5, 2, 3, 4, 0, 2, 5, 3, 1, 4, 2, 0, 3, 5, 2, 4, 1, 3, 0, 5, 2, 4, 3,
  1, 5, 2, 0, 4, 3, 5, 1, 2, 4, 0, 3, 5, 2, 1, 4, 3, 0, 5, 2, 4, 1, 3, 5, 0, 2, 4, 3, 1, 5, 2, 4, 0,
  3, 5, 1, 2, 4, 3, 0, 5, 2,
];

export function ActivityRecordCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-8 py-7">
      <h2 className="text-lg font-semibold">활동 기록</h2>
      <div className="mt-5 overflow-hidden">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {activityLevels.map((level, index) => (
            <span key={`${index}-${level}`} className="size-2.5 rounded-full" data-level={level} />
          ))}
        </div>
        <div className="mt-3 h-1 rounded-full bg-neutral-500" />
      </div>
    </section>
  );
}
