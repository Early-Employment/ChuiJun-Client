/**
 * 교사가 보는 학급 과제 한 건(GET /classrooms/{id}/assignments).
 * 백엔드는 기존 problemId 를 학급에 마감일·필수여부와 함께 연결한다(제출 현황은 미제공).
 */
export interface ClassroomAssignmentItem {
  assignmentId: number;
  problemId: number;
  problemTitle: string;
  /** 마감일 ISO 문자열. */
  dueDate: string;
  required: boolean;
}
