import type { StudentClassroom } from "@/entities/classroom/model/student-classroom";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 student-classroom-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
const MOCK_STUDENT_CLASSROOM: StudentClassroom = {
  className: "알고리즘 (3-1)",
  upcomingAssignments: [
    {
      id: "upcoming-1",
      title: "6차시 수행 평가",
      deadlineLabel: "오늘 23시 59분 마감",
      remainingDays: 0,
    },
    {
      id: "upcoming-2",
      title: "3차시 수행 평가",
      deadlineLabel: "내일 12시 00분 마감",
      remainingDays: 1,
    },
  ],
  assignments: [
    {
      id: "assignment-1",
      title: "6차시 알고리즘 수행평가",
      dateLabel: "5월 3일",
      required: true,
      submissionStatus: "not-submitted",
    },
    {
      id: "assignment-2",
      title: "6차시 알고리즘 수행평가",
      dateLabel: "5월 3일",
      required: false,
      submissionStatus: "submitted",
    },
  ],
};

export function createMockStudentClassroom(): StudentClassroom {
  return MOCK_STUDENT_CLASSROOM;
}
