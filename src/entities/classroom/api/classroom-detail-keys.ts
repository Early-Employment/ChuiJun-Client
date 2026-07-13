import { queryOptions } from "@tanstack/react-query";
import { mapClassroomDetail } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomResponse } from "@/entities/classroom/api/classroom-api-response";
import { instance } from "@/shared/api/instance";
import { getMemberId } from "@/shared/api/member-session-store";

// GET /classrooms/{classroomId} — 학급 상세(이름/학년/반/담당교사).
// 백엔드에 단건 조회 엔드포인트가 없어 교사 학급 목록(GET /classrooms?teacherId)에서 찾는다.
export const classroomDetailKeys = {
  all: ["classroom-detail"] as const,
  detail: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDetailKeys.all, classroomId] as const,
      queryFn: async () => {
        const teacherId = getMemberId();
        if (teacherId === null) {
          throw new Error("교사 회원 ID가 없어 학급을 조회할 수 없습니다.");
        }

        const { data: classrooms } = await instance.get<ClassroomResponse[]>("/classrooms", {
          params: { teacherId },
        });

        const classroom = classrooms.find((candidate) => candidate.id === classroomId);
        if (!classroom) {
          throw new Error("존재하지 않는 학급입니다.");
        }

        return mapClassroomDetail(classroom);
      },
    }),
};
