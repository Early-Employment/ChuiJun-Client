import { CalendarIcon } from "@/shared/assets/CalendarIcon";
import { ChevronDownIcon } from "@/shared/assets/ChevronDownIcon";
import { PaperclipIcon } from "@/shared/assets/PaperclipIcon";
import { PlusCircleIcon } from "@/shared/assets/PlusCircleIcon";

const chipClassName =
  "border-line-strong text-foreground flex items-center gap-2 rounded-md border px-5 py-3 text-base font-medium";

export function AssignmentMetaControls() {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-foreground text-xl font-semibold">문제 정보 선택</legend>
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="button"
          className="border-line-strong text-foreground flex items-center justify-between gap-2 rounded-md border px-4 py-3 text-base font-medium"
        >
          난이도
          <ChevronDownIcon className="size-5" />
        </button>
        <button type="button" className={chipClassName}>
          <PaperclipIcon className="size-4" />
          추가
        </button>
        <button type="button" className={chipClassName}>
          <ChevronDownIcon className="size-4" />
          점수
        </button>
        <button type="button" className={chipClassName}>
          <CalendarIcon className="size-4" />
          기간
        </button>
        <button type="button" className={chipClassName}>
          <PlusCircleIcon className="size-4" />
          테스트 케이스 json 파일 추가
        </button>
      </div>
    </fieldset>
  );
}
