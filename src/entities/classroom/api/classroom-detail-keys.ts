import { queryOptions } from "@tanstack/react-query";
import { createMockClassroomDetail } from "@/entities/classroom/api/classroom-detail-mock";

// GET /classrooms/{classroomId} — 학급 상세(이름/학년/반/담당교사).
// 백엔드 Swagger 에 단건 조회 엔드포인트가 없어 목 데이터로 대체한다.
export const classroomDetailKeys = {
  all: ["classroom-detail"] as const,
  detail: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDetailKeys.all, classroomId] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () =>
      //   mapClassroomDetail((await instance.get<ClassroomResponse>(`/classrooms/${classroomId}`)).data),
      queryFn: async () => createMockClassroomDetail(classroomId),
    }),
};
