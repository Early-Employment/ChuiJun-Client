/** 내 소속 학급. /members/me 가 아직 학년·반을 안 주므로 별도 계약으로 분리한다. */
export interface MemberClassroom {
  /** 학년·반 라벨. 예: "3학년 1반" */
  classLabel: string;
}
