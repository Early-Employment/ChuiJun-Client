import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getMemberId, getMemberRole } from "@/shared/api/member-session-store";
import { mapClassroomSummaries } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomResponse } from "@/entities/classroom/api/classroom-api-response";

// 교사: GET /classrooms?teacherId
// 학생: GET /classrooms/me?studentId
export const classroomSummaryKeys = {
  all: ["classroom-summary"] as const,
  list: () =>
    queryOptions({
      queryKey: [...classroomSummaryKeys.all, "list"] as const,
      queryFn: async () => {
        const memberId = getMemberId();
        if (memberId === null) {
          throw new Error("회원 ID가 없어 학급 목록을 조회할 수 없습니다.");
        }

        const role = getMemberRole();
        const isTeacher = role === "TEACHER" || role === "ADMIN";
        const { data } = isTeacher
          ? await instance.get<ClassroomResponse[]>("/classrooms", {
              params: { teacherId: memberId },
            })
          : await instance.get<ClassroomResponse[]>("/classrooms/me", {
              params: { studentId: memberId },
            });

        return mapClassroomSummaries(data);
      },
    }),
};
