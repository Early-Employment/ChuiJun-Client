// 학급 관련 응답 계약. 백엔드 Swagger(ClassroomResponse, ClassroomAssignmentResponse) 기준.
export interface ClassroomResponse {
  id: number;
  name: string;
  grade: number;
  classNum: number;
  teacherName: string;
}

export interface ClassroomAssignmentResponse {
  assignmentId: number;
  problemId: number;
  problemTitle: string;
  dueDate: string;
  required: boolean;
}
