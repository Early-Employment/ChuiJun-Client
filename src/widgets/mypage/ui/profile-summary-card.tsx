import { EditIcon } from "@/shared/assets/EditIcon";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { TrophyIcon } from "@/shared/assets/TrophyIcon";

export function ProfileSummaryCard() {
  return (
    <section className="border-line bg-surface flex flex-col gap-8 rounded-lg border px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:px-14">
      <div className="relative mx-auto size-40 shrink-0 lg:mx-0">
        <div className="flex size-40 items-center justify-center rounded-full bg-neutral-300">
          <LogoIcon className="size-28" />
        </div>
        <div className="bg-warning-500 absolute right-0 bottom-0 size-12 rounded-full" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-heading font-bold">김도끼</h1>
              <span className="bg-surface-subtle text-muted rounded-lg px-3 py-1 text-sm">
                3학년 1반
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm font-semibold">
              <TrophyIcon className="size-5" />
              <span>gold ll</span>
            </div>
          </div>
          <button
            type="button"
            className="border-line bg-surface-subtle inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
          >
            <EditIcon className="size-3" />
            프로필 수정
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="text-muted flex justify-end text-xs font-medium">67점</div>
          <div className="bg-surface-subtle h-3 overflow-hidden rounded-md">
            <div className="bg-warning-500 h-full w-2/5 rounded-md" />
          </div>
          <div className="text-muted flex justify-between text-xs font-medium">
            <span>골드</span>
            <span>36%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
