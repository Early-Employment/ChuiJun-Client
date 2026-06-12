import type { ClassroomDashboard } from "@/entities/classroom/model/classroom-dashboard";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 classroom-dashboard-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
const MOCK_CLASSROOM_DASHBOARD: ClassroomDashboard = {
  classLabel: "3학년 1반",
  metrics: [
    { id: "submission-rate", label: "전체 제출률", value: "67%" },
    { id: "missing-students", label: "최근 과제 미제출 학생", value: "6명" },
    { id: "accuracy-rate", label: "평균 정답률", value: "77%" },
    { id: "hard-problems", label: "정답률 50% 이하 문제 수", value: "4개" },
  ],
  students: [
    { id: "student-1", name: "유은서", avatarVariant: "neutral" },
    { id: "student-2", name: "유은서", avatarVariant: "neutral" },
    { id: "student-3", name: "박서현", avatarVariant: "highlight" },
  ],
  assignments: [
    {
      id: "assignment-1",
      title: "서현이의 준건이 전화번호 알아내기",
      submissionLabel: "제출 : 18/ 5",
      isPinned: true,
    },
    {
      id: "assignment-2",
      title: "서현이의 준건이 전화번호 알아내기",
      submissionLabel: "제출 : 18/ 5",
      isPinned: false,
    },
    {
      id: "assignment-3",
      title: "서현이의 준건이 전화번호 알아내기",
      submissionLabel: "제출 : 18/ 5",
      isPinned: false,
    },
    {
      id: "assignment-4",
      title: "서현이의 준건이 전화번호 알아내기",
      submissionLabel: "제출 : 18/ 5",
      isPinned: false,
    },
    {
      id: "assignment-5",
      title: "서현이의 준건이 전화번호 알아내기",
      submissionLabel: "제출 : 18/ 5",
      isPinned: false,
    },
  ],
};

export function createMockClassroomDashboard(): ClassroomDashboard {
  return MOCK_CLASSROOM_DASHBOARD;
}
