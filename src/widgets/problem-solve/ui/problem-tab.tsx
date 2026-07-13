"use client";

import { useState } from "react";
import type { ProblemDetail } from "@/entities/problem/model/problem-detail";
import { isSolveBusy, useSolveFlow } from "@/features/code-judge/model/use-solve-flow";
import { ChevronRightIcon } from "@/shared/assets/ChevronRightIcon";
import { RefreshIcon } from "@/shared/assets/RefreshIcon";
import { CodeEditor } from "@/widgets/problem-solve/ui/code-editor";
import { ProblemDescriptionCard } from "@/widgets/problem-solve/ui/problem-description-card";
import { RunResultPanel } from "@/widgets/problem-solve/ui/run-result-panel";
import { SolveResultDialog } from "@/widgets/problem-solve/ui/solve-result-dialog";

const STARTER_CODE = "# 표준 입력은 input(), 출력은 print() 를 사용하세요.\n";

export function ProblemTab({ problem }: { problem: ProblemDetail }) {
  const [code, setCode] = useState(STARTER_CODE);
  const { state, run, submitCode, retry, reset, dismiss } = useSolveFlow(problem);

  const busy = isSolveBusy(state);

  function handleReset() {
    setCode(STARTER_CODE);
    reset();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProblemDescriptionCard problem={problem} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="border-line bg-surface flex w-[120px] items-center justify-between rounded-md border px-4 py-3">
            <span className="text-sm font-medium">python</span>
            <ChevronRightIcon className="size-4 rotate-90" />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-foreground flex items-center gap-1 text-sm font-medium"
            >
              <RefreshIcon className="size-4" />
              초기화
            </button>
            <button
              type="button"
              onClick={() => run(code)}
              disabled={busy}
              className="border-line bg-surface rounded-md border px-4 py-3 text-sm font-medium transition-transform active:scale-95 disabled:opacity-50"
            >
              실행
            </button>
            <button
              type="button"
              onClick={() => submitCode(code)}
              disabled={busy}
              className="border-line-strong bg-surface rounded-md border px-4 py-3 text-sm font-medium transition-transform active:scale-95 disabled:opacity-50"
            >
              제출하기
            </button>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} />

        <RunResultPanel state={state} />
      </section>
      <SolveResultDialog state={state} onClose={dismiss} onRetry={() => retry(code)} />
    </div>
  );
}
