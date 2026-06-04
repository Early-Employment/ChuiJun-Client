import { DiamondIcon } from "@/shared/assets/DiamondIcon";
import { SparkIcon } from "@/shared/assets/SparkIcon";

const badges = [
  { label: "첫번째 문제", icon: "spark" },
  { label: "실버 등급 승급", icon: "diamond" },
  { label: "두번째 문제", icon: "spark" },
  { label: "세번째 문제", icon: "spark" },
  { label: "네번째 문제", icon: "spark" },
];

export function EarnedBadgeCard() {
  return (
    <section className="border-line bg-surface rounded-lg border px-5 py-6 sm:px-8 sm:py-7">
      <h2 className="text-lg font-semibold">획득한 배지</h2>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
            <div className="border-line flex size-14 items-center justify-center rounded-full border">
              {badge.icon === "diamond" ? (
                <DiamondIcon className="text-line-strong size-7" />
              ) : (
                <SparkIcon className="text-foreground size-7" />
              )}
            </div>
            <span className="text-xs font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
