import { queryOptions } from "@tanstack/react-query";
import { createMockClassroomViewer } from "@/entities/classroom/api/classroom-viewer-mock";

export const classroomViewerKeys = {
  all: ["classroom-viewer"] as const,
  current: () =>
    queryOptions({
      queryKey: [...classroomViewerKeys.all, "current"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ClassroomViewer>("/classroom/me")).data,
      queryFn: async () => createMockClassroomViewer(),
    }),
};
