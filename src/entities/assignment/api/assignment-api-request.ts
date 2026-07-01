// 과제 출제/수정 요청 계약. 백엔드 Swagger 기준.
// 백엔드 과제는 기존 problemId 를 학급에 마감일·필수여부와 함께 연결한다(문제 저작 아님).
export interface CreateAssignmentRequest {
  problemId: number;
  dueDate: string;
  required: boolean;
}

// 수정은 마감일·필수여부만 변경 가능(problemId 변경 불가).
export interface UpdateAssignmentRequest {
  dueDate: string;
  required: boolean;
}
