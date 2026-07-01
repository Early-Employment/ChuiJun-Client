import type {
  ClassroomAssignmentResponse,
  ClassroomResponse,
} from "@/entities/classroom/api/classroom-api-response";
import type { ClassroomAssignmentItem } from "@/entities/classroom/model/classroom-assignment-item";
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
