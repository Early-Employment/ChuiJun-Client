import type { ClassroomViewer } from "@/entities/classroom/model/classroom-viewer";

// 백엔드(인증/역할) 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 classroom-viewer-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
// 학생용 학급 페이지를 노출하기 위해 기본 역할을 "student" 로 둔다.
const MOCK_CLASSROOM_VIEWER: ClassroomViewer = {
  role: "student",
};

export function createMockClassroomViewer(): ClassroomViewer {
  return MOCK_CLASSROOM_VIEWER;
}
