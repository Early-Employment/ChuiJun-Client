import { ChevronDownIcon } from "@/shared/assets/ChevronDownIcon";

export function ProblemDescriptionEditor() {
  return (
    <div className="flex w-full flex-col gap-3">
      <span className="text-foreground pl-1 text-xl font-semibold">문제 설명</span>
      <div className="border-line-strong bg-surface focus-within:border-accent overflow-hidden rounded-md border">
        <div className="border-line-strong flex items-center gap-1 border-b px-2 py-1">
          <button
            type="button"
            className="text-muted flex items-center gap-6 rounded-md px-2 py-1 text-sm font-medium"
          >
            12
            <ChevronDownIcon className="size-4" />
          </button>
          <button type="button" className="text-muted px-3 py-2 text-sm font-medium">
            A
          </button>
          <button type="button" className="text-muted px-3 py-2 text-base font-medium">
            A
          </button>
          <button type="button" className="text-muted px-3 py-2 text-lg font-medium">
            A
          </button>
        </div>
        <textarea
          rows={2}
          placeholder="서현이가 준건이의 전화번호를 찾으려고 합니다"
          className="text-foreground placeholder:text-muted w-full resize-none px-4 py-3 text-base font-medium outline-none"
        />
      </div>
    </div>
  );
}
