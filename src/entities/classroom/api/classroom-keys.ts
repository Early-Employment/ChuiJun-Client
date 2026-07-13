import { queryOptions } from "@tanstack/react-query";
import {
  mapClassroomAssignments,
  mapClassroomDashboard,
  mapClassroomDetail,
  mapClassroomSummaries,
} from "@/entities/classroom/api/classroom-api-mapper";
import type {
  ClassroomAssignmentResponse,
  ClassroomResponse,
  ClassroomTeacherDashboardResponse,
} from "@/entities/classroom/api/classroom-api-response";
import type { ClassroomViewer } from "@/entities/classroom/model/classroom-viewer";
import type { StudentClassroom } from "@/entities/classroom/model/student-classroom";
import { instance } from "@/shared/api/instance";
import { getMemberId, getMemberRole } from "@/shared/api/member-session-store";

// GET /classrooms/{classroomId}/teacher-dashboard — 교사 대시보드(통계·학생 목록).
export const classroomDashboardKeys = {
  all: ["classroom-dashboard"] as const,
  current: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomDashboardKeys.all, classroomId] as const,
      queryFn: async () => {
        const { data } = await instance.get<ClassroomTeacherDashboardResponse>(
          `/classrooms/${classroomId}/teacher-dashboard`,
        );

        return mapClassroomDashboard(data);
      },
    }),
};

// GET /classrooms/{classroomId}/assignments — 학급별 과제 목록.
export const classroomAssignmentKeys = {
  all: ["classroom-assignment"] as const,
  list: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomAssignmentKeys.all, "list", classroomId] as const,
      queryFn: async () =>
        mapClassroomAssignments(
          (
            await instance.get<ClassroomAssignmentResponse[]>(
              `/classrooms/${classroomId}/assignments`,
            )
          ).data,
        ),
    }),
};

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

// 교사: GET /classrooms/teacher
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
          ? await instance.get<ClassroomResponse[]>("/classrooms/teacher")
          : await instance.get<ClassroomResponse[]>("/classrooms/me", {
              params: { studentId: memberId },
            });

        return mapClassroomSummaries(data);
      },
    }),
};

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

function formatClassroomName(classroom: ClassroomResponse) {
  return `${classroom.name} (${classroom.grade}-${classroom.classNum})`;
}

function formatDateLabel(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDeadlineLabel(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;
  return `${date.getMonth() + 1}월 ${date.getDate()}일까지`;
}

function toRemainingDays(dateTime: string) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return 0;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function mapStudentClassroom(
  classroom: ClassroomResponse,
  assignments: ClassroomAssignmentResponse[],
): StudentClassroom {
  const sortedAssignments = [...assignments].sort(
    (left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
  );

  return {
    classroomName: formatClassroomName(classroom),
    teacherName: classroom.teacherName,
    upcomingAssignments: sortedAssignments.slice(0, 2).map((assignment) => ({
      id: String(assignment.assignmentId),
      problemId: assignment.problemId,
      title: assignment.problemTitle,
      deadlineLabel: formatDeadlineLabel(assignment.dueDate),
      remainingDays: toRemainingDays(assignment.dueDate),
    })),
    assignments: sortedAssignments.map((assignment) => ({
      id: String(assignment.assignmentId),
      problemId: assignment.problemId,
      title: assignment.problemTitle,
      dateLabel: formatDateLabel(assignment.dueDate),
      required: assignment.required,
      submissionStatus: assignment.submitted ? "submitted" : "not-submitted",
    })),
  };
}

export const studentClassroomKeys = {
  all: ["student-classroom"] as const,
  current: (classroomId: number) =>
    queryOptions({
      queryKey: [...studentClassroomKeys.all, "current", classroomId] as const,
      queryFn: async () => {
        const studentId = getMemberId();
        if (studentId === null) {
          throw new Error("학생 회원 ID가 없어 학급을 조회할 수 없습니다.");
        }

        const [{ data: classrooms }, { data: assignments }] = await Promise.all([
          instance.get<ClassroomResponse[]>("/classrooms/me", {
            params: { studentId },
          }),
          instance.get<ClassroomAssignmentResponse[]>(`/classrooms/${classroomId}/assignments`),
        ]);

        // GET /classrooms/{id}는 소속 여부를 검증하지 않으므로, 본인 소속 학급만
        // 내려주는 GET /classrooms/me 결과에서 찾아 다른 학급 정보 열람을 막는다.
        const classroom = classrooms.find((candidate) => candidate.id === classroomId);
        if (!classroom) {
          throw new Error("학생이 소속되지 않은 학급입니다.");
        }

        return mapStudentClassroom(classroom, assignments);
      },
    }),
};
