/** 학급 상세(GET /classrooms/{id}). 교사 대시보드 헤더 라벨에 쓴다. */
export interface ClassroomDetail {
  id: number;
  name: string;
  /** 학급 라벨. 예: "3학년 1반" */
  classLabel: string;
  teacherName: string;
}
