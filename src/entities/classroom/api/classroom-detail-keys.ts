import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { mapClassroomDetail } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomResponse } from "@/entities/classroom/api/classroom-api-response";

// GET /classrooms/{classroomId} — 학급 상세(이름/학년/반/담당교사).
export const classroomDetailKeys = {
  all: ["classroom-detail"] as const,
  detail: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDetailKeys.all, classroomId] as const,
      queryFn: async () =>
        mapClassroomDetail(
          (await instance.get<ClassroomResponse>(`/classrooms/${classroomId}`)).data,
        ),
    }),
};
