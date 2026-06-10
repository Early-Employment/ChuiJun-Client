import { ChevronLeftIcon } from "@/shared/assets/ChevronLeftIcon";
import { AssignmentMetaControls } from "@/widgets/assignment-form/ui/assignment-meta-controls";
import { ExampleIoRow } from "@/widgets/assignment-form/ui/example-io-row";
import { LabeledField } from "@/widgets/assignment-form/ui/labeled-field";
import { ProblemDescriptionEditor } from "@/widgets/assignment-form/ui/problem-description-editor";
import { VisibilityRadioGroup } from "@/widgets/assignment-form/ui/visibility-radio-group";

const fieldClassName =
  "border-line-strong bg-surface text-foreground placeholder:text-muted focus:border-accent w-full rounded-md border px-4 py-3 text-base font-medium outline-none";

export function AssignmentForm() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6">
      <form className="border-line-strong bg-surface flex flex-col gap-5 rounded-lg border px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="text-muted flex w-fit items-center gap-1 text-base font-medium"
          >
            <ChevronLeftIcon className="size-5" />
            뒤로가기
          </button>
          <h1 className="text-foreground text-display font-semibold">문제 출제</h1>
        </div>

        <div className="flex flex-col gap-4">
          <LabeledField label="제목">
            <input
              type="text"
              placeholder="서현이의 준건이 번호 알아내기"
              className={fieldClassName}
            />
          </LabeledField>

          <ProblemDescriptionEditor />

          <LabeledField label="입력">
            <textarea
              rows={3}
              placeholder={"첫째줄이 n이 주어진다\n둘째줄에 x가 주어진다"}
              className={`${fieldClassName} resize-none`}
            />
          </LabeledField>

          <LabeledField label="출력">
            <textarea
              rows={3}
              placeholder="이준건의 전화번호가 출력되어야 한다."
              className={`${fieldClassName} resize-none`}
            />
          </LabeledField>

          <ExampleIoRow inputLabel="예제 입력 1" outputLabel="예제 출력 1" />
          <ExampleIoRow inputLabel="예제 입력 2" outputLabel="예제 출력 2" />
        </div>

        <VisibilityRadioGroup />
        <AssignmentMetaControls />

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-accent border-accent-strong text-neutral-0 rounded-md border px-7 py-3 text-xl font-bold"
          >
            작성 완료
          </button>
        </div>
      </form>
    </main>
  );
}
