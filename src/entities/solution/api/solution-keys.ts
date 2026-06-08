import { queryOptions } from "@tanstack/react-query";
import type { SolutionDetail, SolutionPage } from "@/entities/solution/model/solution";
import {
  createMockSolutionDetail,
  createMockSolutionPage,
  toggleMockSolutionLike,
} from "@/entities/solution/api/solution-mock";

export const solutionKeys = {
  all: ["solution"] as const,
  list: (problemId: number, page: number) =>
    queryOptions({
      queryKey: [...solutionKeys.all, "list", problemId, page] as const,
      // 백엔드 미구현: 목 페이지 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<SolutionPage>(`/problems/${problemId}/solutions`, { params: { page } })).data,
      queryFn: async (): Promise<SolutionPage> => createMockSolutionPage(problemId, page),
    }),
  detail: (solutionId: number) =>
    queryOptions({
      queryKey: [...solutionKeys.all, "detail", solutionId] as const,
      // 백엔드 미구현: 목 상세 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<SolutionDetail>(`/solutions/${solutionId}`)).data,
      queryFn: async (): Promise<SolutionDetail> => createMockSolutionDetail(solutionId),
    }),
  like: (solutionId: number) => ({
    mutationKey: [...solutionKeys.all, "like", solutionId] as const,
    // 백엔드 미구현: 목 토글. 실전환 시 아래 한 줄로 교체한다.
    // mutationFn: async () => (await instance.post(`/solutions/${solutionId}/like`)).data,
    mutationFn: async () => toggleMockSolutionLike(solutionId),
  }),
};
