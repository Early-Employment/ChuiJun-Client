import { queryOptions } from "@tanstack/react-query";
import { mapClassroomDetail } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomResponse } from "@/entities/classroom/api/classroom-api-response";
import { instance } from "@/shared/api/instance";

// GET /classrooms/{classroomId} — 학급 상세(이름/학년/반/담당교사).
export const classroomDetailKeys = {
  all: ["classroom-detail"] as const,
  detail: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDetailKeys.all, classroomId] as const,
      queryFn: async () => {
        const { data: classroom } = await instance.get<ClassroomResponse>(
          `/classrooms/${classroomId}`,
        );

        return mapClassroomDetail(classroom);
      },
    }),
};
