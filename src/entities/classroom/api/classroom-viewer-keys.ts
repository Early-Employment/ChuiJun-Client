import { queryOptions } from "@tanstack/react-query";
import { getMemberRole } from "@/shared/api/member-session-store";
import type { ClassroomViewer } from "@/entities/classroom/model/classroom-viewer";

// 학급 화면의 교사/학생 분기 역할. 로그인 시 보관한 role(STUDENT/TEACHER/ADMIN)에서 파생한다.
// TEACHER 만 교사 화면을 보고, 그 외(STUDENT/ADMIN/미인증)는 학생 화면으로 둔다.
export const classroomViewerKeys = {
  all: ["classroom-viewer"] as const,
  current: () =>
    queryOptions({
      queryKey: [...classroomViewerKeys.all, "current"] as const,
      queryFn: async (): Promise<ClassroomViewer> => ({
        role: getMemberRole() === "TEACHER" ? "teacher" : "student",
      }),
    }),
};
