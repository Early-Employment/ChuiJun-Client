import { CheckCircleIcon } from "@/shared/assets/CheckCircleIcon";
import { CodeIcon } from "@/shared/assets/CodeIcon";
import { TrendIcon } from "@/shared/assets/TrendIcon";

const profileStats = [
  { label: "시도한 문제", value: "105", icon: <CodeIcon className="size-5" /> },
  { label: "맞춘 문제", value: "67", icon: <CheckCircleIcon className="size-5" /> },
  { label: "연속 풀이 기록", value: "17일", icon: <TrendIcon className="size-5" /> },
];

export function ProfileStatCards() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {profileStats.map((stat) => (
        <article
          key={stat.label}
          className="border-line bg-surface flex h-36 flex-col justify-between rounded-lg border px-5 py-6 sm:px-8 sm:py-7"
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            {stat.icon}
            <span>{stat.label}</span>
          </div>
          <strong className="self-end text-4xl font-semibold">{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}
