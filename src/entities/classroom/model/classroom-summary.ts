/**
 * 학급 목록 화면(/class)의 카드 한 장.
 * 카드를 누르면 상세(/class/[classId])로 진입한다. 교사·학생이 같은 목록을 거쳐간다.
 */
export interface ClassroomSummary {
  id: string;
  /** 수업/과목 이름. 예: "알고리즘" */
  courseName: string;
  /** 학급 라벨. 예: "3학년 1반" */
  classLabel: string;
  /** 담당 교사 이름. 예: "김륜엽" */
  teacherName: string;
  /** 아바타에 표시할 짧은 이름. 예: "륜엽" */
  avatarLabel: string;
}
