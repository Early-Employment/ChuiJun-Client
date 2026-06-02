import { queryOptions } from "@tanstack/react-query";
import { createMockWrongProblems } from "@/entities/problem/api/wrong-problem-mock";

export const problemKeys = {
  all: ["problem"] as const,
  wrong: () =>
    queryOptions({
      queryKey: [...problemKeys.all, "wrong"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<WrongProblem[]>("/problems/wrong")).data,
      queryFn: async () => createMockWrongProblems(),
    }),
};
