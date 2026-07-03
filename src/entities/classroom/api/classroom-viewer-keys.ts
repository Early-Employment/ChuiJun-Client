import { queryOptions } from "@tanstack/react-query";
import { getMemberRole } from "@/shared/api/member-session-store";
import type { ClassroomViewer } from "@/entities/classroom/model/classroom-viewer";

// 학급 화면의 교사/학생 분기 역할. 로그인 시 보관한 role(STUDENT/TEACHER/ADMIN)에서 파생한다.
// STUDENT 만 학생 화면을 보고, TEACHER/ADMIN 은 교사 화면으로 둔다.
export const classroomViewerKeys = {
  all: ["classroom-viewer"] as const,
  current: () =>
    queryOptions({
      queryKey: [...classroomViewerKeys.all, "current"] as const,
      queryFn: async (): Promise<ClassroomViewer> => {
        const role = getMemberRole();

        return {
          role: role === "TEACHER" || role === "ADMIN" ? "teacher" : "student",
        };
      },
    }),
};
