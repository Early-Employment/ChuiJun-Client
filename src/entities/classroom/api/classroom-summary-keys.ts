import { queryOptions } from "@tanstack/react-query";
import { createMockClassroomSummaries } from "@/entities/classroom/api/classroom-summary-mock";

export const classroomSummaryKeys = {
  all: ["classroom-summary"] as const,
  list: () =>
    queryOptions({
      queryKey: [...classroomSummaryKeys.all, "list"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ClassroomSummary[]>("/classroom")).data,
      queryFn: async () => createMockClassroomSummaries(),
    }),
};
