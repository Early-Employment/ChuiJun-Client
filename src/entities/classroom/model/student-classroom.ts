/** 곧 마감되는 과제 한 건. 학생용 학급 페이지 좌측 카드에 노출된다. */
export interface StudentUpcomingAssignment {
  id: string;
  title: string;
  /** 마감 안내 문구. 예: "오늘 23시 59분 마감" */
  deadlineLabel: string;
  /** 남은 일수. 0이면 D-0(오늘 마감). */
  remainingDays: number;
}

export type StudentSubmissionStatus = "submitted" | "not-submitted";

/** 학생이 보는 과제 목록 한 건. */
export interface StudentAssignment {
  id: string;
  title: string;
  /** 노출 날짜 문구. 예: "5월 3일" */
  dateLabel: string;
  /** 필수 과제 여부. true면 "필수" 뱃지 노출. */
  required: boolean;
  submissionStatus: StudentSubmissionStatus;
}

export interface StudentClassroom {
  /** 학급 이름. 예: "알고리즘 (3-1)" */
  classroomName: string;
  upcomingAssignments: StudentUpcomingAssignment[];
  assignments: StudentAssignment[];
}
