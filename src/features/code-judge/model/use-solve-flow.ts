"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classroomAssignmentKeys } from "@/entities/classroom/api/classroom-assignment-keys";
import { studentClassroomKeys } from "@/entities/classroom/api/student-classroom-keys";
import { memberKeys } from "@/entities/member/api/member-keys";
import type { ProblemDetail } from "@/entities/problem/model/problem-detail";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { rankingKeys } from "@/entities/ranking/api/ranking-keys";
import { submissionKeys } from "@/entities/submission/api/submission-keys";
import {
  isSubmissionPassed,
  type SubmissionPayload,
  type SubmissionRecord,
} from "@/entities/submission/model/submission";
import {
  judge,
  JudgeCancelledError,
  type JudgeReport,
  type TestcaseOutcome,
} from "@/features/code-judge/model/judge";
import { runExamples } from "@/features/code-judge/model/run-examples";
import { discardWorker, warmRuntime } from "@/shared/lib/pyodide/python-runner";

// 예제 실행은 문제의 채점 제한시간이 아니라, Pyodide 콜드 로드까지 견딜 넉넉한
// 벽시계 타임아웃을 쓴다. (채점은 judge 가 케이스별로 timeLimitMs 를 적용한다.)
const EXAMPLE_RUN_TIMEOUT_MS = 10000;

/**
 * 문제 풀이 화면의 단일 상태 머신.
 *
 *   idle ─[실행]→ running → ran
 *     └─[제출]→ judging ─실패→ error(judge)
 *                  ↓
 *              submitting ─실패→ error(submit)
 *                  ├─ AC → solved
 *                  └─ 그 외 → wrong
 *
 * 채점 실패(사용자 코드)와 전송 실패(서버)는 서로 다른 축이므로 error 가 cause 를 들고 있다.
 * submitting 이 payload 를 들고 있는 이유는 재전송 시 studySeconds 를 다시 계산하지 않기 위해서다.
 */
export type SolveState =
  | { phase: "idle" }
  | { phase: "running" }
  | { phase: "ran"; examples: TestcaseOutcome[] }
  | { phase: "judging" }
  | { phase: "submitting"; payload: SubmissionPayload; report: JudgeReport }
  | { phase: "solved"; report: JudgeReport; record: SubmissionRecord; dismissed: boolean }
  | { phase: "wrong"; report: JudgeReport; record: SubmissionRecord; dismissed: boolean }
  | { phase: "error"; cause: "judge"; message: string; dismissed: boolean }
  | {
      phase: "error";
      cause: "submit";
      payload: SubmissionPayload;
      report: JudgeReport;
      dismissed: boolean;
    };

type SolveAction =
  | { type: "reset" }
  | { type: "run-started" }
  | { type: "run-finished"; examples: TestcaseOutcome[] }
  | { type: "judge-started" }
  | { type: "judge-failed"; message: string }
  | { type: "submit-started"; payload: SubmissionPayload; report: JudgeReport }
  | { type: "submit-succeeded"; record: SubmissionRecord }
  | { type: "submit-failed" }
  | { type: "dismissed" };

const CHECKING_RUNTIME_MESSAGE = "채점기를 불러오지 못했어요.";

function solveReducer(state: SolveState, action: SolveAction): SolveState {
  switch (action.type) {
    case "reset":
      return { phase: "idle" };

    case "run-started":
      return { phase: "running" };

    case "run-finished":
      return { phase: "ran", examples: action.examples };

    case "judge-started":
      return { phase: "judging" };

    case "judge-failed":
      return { phase: "error", cause: "judge", message: action.message, dismissed: false };

    case "submit-started":
      return { phase: "submitting", payload: action.payload, report: action.report };

    case "submit-succeeded": {
      if (state.phase !== "submitting") return state;
      // 성공/실패의 단일 진실은 서버 응답이다. 프론트 채점(report.passed)이 아니다 —
      // 서버가 RE/WA 로 되돌리면 프론트가 AC 라 판정했어도 오답 모달을 띄워야 한다.
      return isSubmissionPassed(action.record)
        ? { phase: "solved", report: state.report, record: action.record, dismissed: false }
        : { phase: "wrong", report: state.report, record: action.record, dismissed: false };
    }

    case "submit-failed": {
      if (state.phase !== "submitting") return state;
      return {
        phase: "error",
        cause: "submit",
        payload: state.payload,
        report: state.report,
        dismissed: false,
      };
    }

    case "dismissed": {
      if (state.phase !== "solved" && state.phase !== "wrong" && state.phase !== "error") {
        return state;
      }
      return { ...state, dismissed: true };
    }
  }
}

/** 채점·제출이 진행 중이라 실행/제출 버튼을 잠가야 하는 상태. */
export function isSolveBusy(state: SolveState): boolean {
  return state.phase === "running" || state.phase === "judging" || state.phase === "submitting";
}

/** 종단 상태이면서 아직 닫지 않은 결과 모달이 있는가. */
export function isResultOpen(state: SolveState): boolean {
  if (state.phase !== "solved" && state.phase !== "wrong" && state.phase !== "error") return false;
  return !state.dismissed;
}

export function useSolveFlow(problem: ProblemDetail) {
  const queryClient = useQueryClient();
  const submit = useMutation(submissionKeys.submit());
  const [state, dispatch] = useReducer(solveReducer, { phase: "idle" });

  // 문제를 연 시점. 첫 제출 시도에서 studySeconds(풀이 소요 시간)를 한 번만 계산한다.
  const openedAt = useRef(Date.now());
  // 채점기 로드 실패는 실행·제출 어느 쪽에서도 난다. 재시도가 엉뚱한 동작을 하지 않도록 기억한다.
  const lastIntent = useRef<"run" | "submit">("submit");

  // Pyodide 로드(수 초)를 첫 실행 전에 끝내 두고, 화면을 떠나면 진행 중인 채점을 취소한다.
  // 취소하지 않으면 전역 큐에 남아 다음 화면의 실행을 뒤에 줄 세운다.
  useEffect(() => {
    warmRuntime();
    return discardWorker;
  }, []);

  const invalidateAfterSubmit = useCallback(async () => {
    // 오답도 서버에 기록된다 — 틀린 문제 목록·잔디·정답률이 모두 바뀐다.
    // 그래서 무효화 기준은 판정이 아니라 제출 성공이다.
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: memberKeys.all }),
      queryClient.invalidateQueries({ queryKey: rankingKeys.all }),
      queryClient.invalidateQueries({ queryKey: problemKeys.all }),
      // 과제 진행률도 제출로 바뀐다.
      queryClient.invalidateQueries({ queryKey: studentClassroomKeys.all }),
      queryClient.invalidateQueries({ queryKey: classroomAssignmentKeys.all }),
    ]);
  }, [queryClient]);

  const send = useCallback(
    async (payload: SubmissionPayload, report: JudgeReport) => {
      dispatch({ type: "submit-started", payload, report });
      try {
        const record = await submit.mutateAsync(payload);
        dispatch({ type: "submit-succeeded", record });
      } catch {
        dispatch({ type: "submit-failed" });
        return;
      }
      await invalidateAfterSubmit();
    },
    [invalidateAfterSubmit, submit],
  );

  const run = useCallback(
    async (code: string) => {
      lastIntent.current = "run";
      dispatch({ type: "run-started" });
      try {
        const examples = await runExamples(code, problem.examples, EXAMPLE_RUN_TIMEOUT_MS);
        dispatch({ type: "run-finished", examples });
      } catch (error) {
        if (error instanceof JudgeCancelledError) return;
        dispatch({ type: "judge-failed", message: runtimeMessage(error) });
      }
    },
    [problem.examples],
  );

  const submitCode = useCallback(
    async (code: string) => {
      lastIntent.current = "submit";
      dispatch({ type: "judge-started" });

      let report: JudgeReport;
      try {
        report = await judge(problem.id, code, problem.testcases, problem.timeLimitMs);
      } catch (error) {
        if (error instanceof JudgeCancelledError) return;
        dispatch({ type: "judge-failed", message: runtimeMessage(error) });
        return;
      }

      await send(
        {
          problemId: problem.id,
          judgeStatus: report.result.judgeStatus,
          code,
          score: report.result.passed ? problem.score : 0,
          studySeconds: Math.max(0, Math.round((Date.now() - openedAt.current) / 1000)),
        },
        report,
      );
    },
    [problem, send],
  );

  const retry = useCallback(
    async (code: string) => {
      if (state.phase !== "error") return;

      // 전송만 실패했다면 판정은 그대로다. 재채점하면 TLE 가 벽시계 기준이라 판정이 뒤집힐 수 있다.
      if (state.cause === "submit") {
        await send(state.payload, state.report);
        return;
      }

      // 채점기 로드에 실패한 워커는 거부된 promise 를 캐시하고 있다. 버리고 새로 띄운다.
      discardWorker();
      // 실행하다 실패했으면 실행을, 제출하다 실패했으면 제출을 다시 한다.
      if (lastIntent.current === "run") {
        await run(code);
        return;
      }
      await submitCode(code);
    },
    [run, send, state, submitCode],
  );

  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const dismiss = useCallback(() => dispatch({ type: "dismissed" }), []);

  return { state, run, submitCode, retry, reset, dismiss };
}

function runtimeMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : CHECKING_RUNTIME_MESSAGE;
}
