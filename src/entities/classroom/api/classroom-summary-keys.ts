import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getMemberId } from "@/shared/api/member-session-store";
import { mapClassroomSummaries } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomResponse } from "@/entities/classroom/api/classroom-api-response";

// GET /classrooms?teacherId — 로그인한 교사가 개설한 학급 목록.
// (학생용 "내 학급" 목록 엔드포인트는 백엔드 미제공으로 보류)
export const classroomSummaryKeys = {
  all: ["classroom-summary"] as const,
  list: () =>
    queryOptions({
      queryKey: [...classroomSummaryKeys.all, "list"] as const,
      queryFn: async () => {
        const { data } = await instance.get<ClassroomResponse[]>("/classrooms", {
          params: { teacherId: getMemberId() },
        });
        return mapClassroomSummaries(data);
      },
    }),
};
