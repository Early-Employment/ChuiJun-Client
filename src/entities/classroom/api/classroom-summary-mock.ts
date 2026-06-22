import type { ClassroomSummary } from "@/entities/classroom/model/classroom-summary";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 classroom-summary-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
const MOCK_CLASSROOM_SUMMARIES: ClassroomSummary[] = [
  {
    id: "class-3-1",
    courseName: "알고리즘",
    classLabel: "3학년 1반",
    teacherName: "김륜엽",
    avatarLabel: "륜엽",
  },
  {
    id: "class-3-2",
    courseName: "알고리즘",
    classLabel: "3학년 2반",
    teacherName: "김륜엽",
    avatarLabel: "륜엽",
  },
];

export function createMockClassroomSummaries(): ClassroomSummary[] {
  return MOCK_CLASSROOM_SUMMARIES;
}
