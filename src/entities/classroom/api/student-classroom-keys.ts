import { queryOptions } from "@tanstack/react-query";
import type {
  ClassroomAssignmentResponse,
  ClassroomResponse,
} from "@/entities/classroom/api/classroom-api-response";
import type { StudentClassroom } from "@/entities/classroom/model/student-classroom";
import { instance } from "@/shared/api/instance";
import { getMemberId } from "@/shared/api/member-session-store";

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

        // 백엔드에 단건 조회(GET /classrooms/{id})가 없어 목록 조회 결과에서 찾는다.
        const classroom = classrooms.find((candidate) => candidate.id === classroomId);
        if (!classroom) {
          throw new Error("학생이 소속되지 않은 학급입니다.");
        }

        return mapStudentClassroom(classroom, assignments);
      },
    }),
};
