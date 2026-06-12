/** 학급 화면을 보는 사용자의 역할. 같은 /class 라우트를 역할에 따라 분기하는 데 쓴다. */
export type ClassroomViewerRole = "teacher" | "student";

export interface ClassroomViewer {
  role: ClassroomViewerRole;
}
