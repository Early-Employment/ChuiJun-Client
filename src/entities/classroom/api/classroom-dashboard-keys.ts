import { queryOptions } from "@tanstack/react-query";
import { createMockClassroomDashboard } from "@/entities/classroom/api/classroom-dashboard-mock";

export const classroomDashboardKeys = {
  all: ["classroom-dashboard"] as const,
  current: () =>
    queryOptions({
      queryKey: [...classroomDashboardKeys.all, "current"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ClassroomDashboard>("/classroom/current")).data,
      queryFn: async () => createMockClassroomDashboard(),
    }),
};
