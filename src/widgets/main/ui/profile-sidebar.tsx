const statItems = [
  { label: "종합 랭킹", value: "1위" },
  { label: "푼 문제", value: "1개" },
  { label: "티어", value: "플래티넘" },
] as const;

export function ProfileSidebar() {
  return (
    <aside className="self-start rounded-lg border border-line bg-surface p-6 shadow-sm">
      <h2 className="text-3xl font-extrabold text-foreground">000 선생님, 어서오세요!</h2>

      <div className="mt-5 grid grid-cols-3 gap-5">
        {statItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-body text-muted">{item.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <h3 className="text-3xl font-extrabold text-foreground">이번 달 활동 기록</h3>
        <div className="mt-5 rounded-md bg-surface p-1">
          <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
            {Array.from({ length: 180 }, (_, index) => {
              const strong = index % 9 === 0 || index % 11 === 0;
              const medium = index % 4 === 0 || index % 7 === 0;

              return (
                <span
                  key={index}
                  className={`h-3.5 w-3.5 rounded-full ${
                    strong ? "bg-info-500" : medium ? "bg-info-100" : "bg-info-50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
