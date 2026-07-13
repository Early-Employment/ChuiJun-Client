import { queryOptions } from "@tanstack/react-query";
import { mapClassroomDashboard } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomTeacherDashboardResponse } from "@/entities/classroom/api/classroom-api-response";
import { instance } from "@/shared/api/instance";

// GET /classrooms/{classroomId}/teacher-dashboard — 교사 대시보드(통계·학생 목록).
export const classroomDashboardKeys = {
  all: ["classroom-dashboard"] as const,
  current: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDashboardKeys.all, classroomId] as const,
      queryFn: async () => {
        const { data } = await instance.get<ClassroomTeacherDashboardResponse>(
          `/classrooms/${classroomId}/teacher-dashboard`,
        );

        return mapClassroomDashboard(data);
      },
    }),
};
