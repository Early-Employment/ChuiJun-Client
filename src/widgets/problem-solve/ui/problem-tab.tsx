"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProblemDetail } from "@/entities/problem/model/problem-detail";
import { submissionKeys } from "@/entities/submission/api/submission-keys";
import { judge, type JudgeReport } from "@/features/code-judge/model/judge";
import { ChevronRightIcon } from "@/shared/assets/ChevronRightIcon";
import { RefreshIcon } from "@/shared/assets/RefreshIcon";
import { CodeEditor } from "@/widgets/problem-solve/ui/code-editor";
import { ProblemDescriptionCard } from "@/widgets/problem-solve/ui/problem-description-card";
import { RunResultPanel } from "@/widgets/problem-solve/ui/run-result-panel";

const STARTER_CODE = "# 표준 입력은 input(), 출력은 print() 를 사용하세요.\n";

export function ProblemTab({ problem }: { problem: ProblemDetail }) {
  const queryClient = useQueryClient();
  const submit = useMutation(submissionKeys.submit());

  const [code, setCode] = useState(STARTER_CODE);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<JudgeReport | null>(null);

  function handleReset() {
    setCode(STARTER_CODE);
    setReport(null);
  }

  async function handleSubmit() {
    setRunning(true);
    const judged = await judge(problem.id, code, problem.testcases, problem.timeLimitMs);
    setReport(judged);
    setRunning(false);

    submit.mutate(
      { ...judged.result, code },
      {
        onSuccess: () => {
          // 친구 풀이 보기 게이트 해제 (§5 계약: 실전환 시 invalidate 로 교체).
          queryClient.setQueryData(submissionKeys.hasSubmitted(problem.id).queryKey, true);
        },
      },
    );
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
              onClick={handleSubmit}
              disabled={running}
              className="border-line-strong bg-surface rounded-md border px-4 py-3 text-sm font-medium disabled:opacity-50"
            >
              제출하기
            </button>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} />
        <RunResultPanel running={running} runResult={null} report={report} />
      </section>
    </div>
  );
}
