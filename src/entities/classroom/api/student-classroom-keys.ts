import { queryOptions } from "@tanstack/react-query";
import { createMockStudentClassroom } from "@/entities/classroom/api/student-classroom-mock";

export const studentClassroomKeys = {
  all: ["student-classroom"] as const,
  current: () =>
    queryOptions({
      queryKey: [...studentClassroomKeys.all, "current"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<StudentClassroom>("/classroom/student/current")).data,
      queryFn: async () => createMockStudentClassroom(),
    }),
};
