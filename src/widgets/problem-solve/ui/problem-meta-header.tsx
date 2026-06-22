import { ClockIcon } from "@/shared/assets/ClockIcon";
import { CpuIcon } from "@/shared/assets/CpuIcon";

interface Props {
  tier: string;
  score: number;
  title: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  correctRate: number;
}

export function ProblemMetaHeader({
  tier,
  score,
  title,
  timeLimitMs,
  memoryLimitMb,
  correctRate,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <span className="border-reward bg-reward-soft text-reward rounded-full border px-3 py-1 text-sm font-medium">
          {tier}
        </span>
        <span className="text-muted text-sm font-medium">+ {score} 점</span>
      </div>

      <h1 className="text-heading font-bold">{title}</h1>

      <div className="text-muted flex items-center gap-4 text-sm font-medium">
        <span className="flex items-center gap-1">
          <ClockIcon className="size-[19px]" />
          {timeLimitMs}ms
        </span>
        <span className="flex items-center gap-1">
          <CpuIcon className="size-[19px]" />
          {memoryLimitMb} MB
        </span>
        <span>정답률 {correctRate}%</span>
      </div>
    </div>
  );
}
