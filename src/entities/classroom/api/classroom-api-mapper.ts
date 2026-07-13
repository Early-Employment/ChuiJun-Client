import type {
  ClassroomAssignmentResponse,
  ClassroomResponse,
  ClassroomTeacherDashboardResponse,
} from "@/entities/classroom/api/classroom-api-response";
import type { ClassroomAssignmentItem } from "@/entities/classroom/model/classroom-assignment-item";
import type { ClassroomDashboard } from "@/entities/classroom/model/classroom-dashboard";
import type { ClassroomDetail } from "@/entities/classroom/model/classroom-detail";
import type { ClassroomSummary } from "@/entities/classroom/model/classroom-summary";

function toClassLabel(grade: number, classNum: number) {
  return `${grade}학년 ${classNum}반`;
}

export function mapClassroomSummary(classroom: ClassroomResponse): ClassroomSummary {
  return {
    id: String(classroom.id),
    courseName: classroom.name,
    classLabel: toClassLabel(classroom.grade, classroom.classNum),
    teacherName: classroom.teacherName,
    avatarLabel: classroom.teacherName.slice(-2),
  };
}

export function mapClassroomSummaries(classrooms: ClassroomResponse[]): ClassroomSummary[] {
  return classrooms.map(mapClassroomSummary);
}

export function mapClassroomDetail(classroom: ClassroomResponse): ClassroomDetail {
  return {
    id: classroom.id,
    name: classroom.name,
    classLabel: toClassLabel(classroom.grade, classroom.classNum),
    teacherName: classroom.teacherName,
  };
}

export function mapClassroomAssignment(
  assignment: ClassroomAssignmentResponse,
): ClassroomAssignmentItem {
  return {
    assignmentId: assignment.assignmentId,
    problemId: assignment.problemId,
    problemTitle: assignment.problemTitle,
    dueDate: assignment.dueDate,
    required: assignment.required,
  };
}

export function mapClassroomAssignments(
  assignments: ClassroomAssignmentResponse[],
): ClassroomAssignmentItem[] {
  return assignments.map(mapClassroomAssignment);
}

export function mapClassroomDashboard(
  dashboard: ClassroomTeacherDashboardResponse,
): ClassroomDashboard {
  const { stats } = dashboard;

  return {
    metrics: [
      { id: "submission-rate", label: "전체 제출률", value: `${stats.totalSubmissionRate}%` },
      {
        id: "missing-students",
        label: "최근 과제 미제출 학생",
        value: `${stats.recentMissingStudentsCount}명`,
      },
      { id: "accuracy-rate", label: "평균 정답률", value: `${stats.averageCorrectRate}%` },
      {
        id: "hard-problems",
        label: "정답률 50% 이하 문제 수",
        value: `${stats.lowCorrectRateProblemCount}개`,
      },
    ],
    students: dashboard.students.map((student) => ({
      id: String(student.memberId),
      name: student.name,
      profileImageUrl: student.profileImageUrl,
    })),
  };
}
