import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { mapProblemDetail, mapProblemListPage } from "@/entities/problem/api/problem-api-mapper";
import type {
  ProblemApiDetailResponse,
  ProblemApiPageResponse,
} from "@/entities/problem/api/problem-api-response";
import { createMockWrongProblems } from "@/entities/problem/api/wrong-problem-mock";

export const problemKeys = {
  all: ["problem"] as const,
  list: (page: number, size: number) =>
    queryOptions({
      queryKey: [...problemKeys.all, "list", page, size] as const,
      queryFn: async () => {
        const { data } = await instance.get<ProblemApiPageResponse>("/problems", {
          params: { page, size },
        });
        return mapProblemListPage(data);
      },
    }),
  wrong: () =>
    queryOptions({
      queryKey: [...problemKeys.all, "wrong"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<WrongProblem[]>("/problems/wrong")).data,
      queryFn: async () => createMockWrongProblems(),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...problemKeys.all, "detail", id] as const,
      queryFn: async () =>
        mapProblemDetail((await instance.get<ProblemApiDetailResponse>(`/problems/${id}`)).data),
    }),
};
