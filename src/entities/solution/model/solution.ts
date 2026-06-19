/** 친구 풀이 목록의 한 행. */
export interface SolutionSummary {
  id: number;
  /** 작성자 이름 */
  author: string;
  /** 작성 언어 (C, Swift, Python …) */
  language: string;
  /** 풀이 시간 (mm:ss 또는 hh:mm:ss) */
  solveTime: string;
  views: number;
  comments: number;
  likes: number;
}

/** 친구 풀이 상세. */
export interface SolutionDetail {
  id: number;
  author: string;
  /** 작성자 식별 번호 (디자인의 "3106") */
  authorId: number;
  /** 작성 시각 (yyyy.MM.dd HH:mm) */
  createdAt: string;
  language: string;
  /** 풀이 소스 코드 (읽기전용 표시) */
  code: string;
  likes: number;
  /** 내가 좋아요를 눌렀는지 */
  liked: boolean;
  /** 댓글 수 (표시만) */
  comments: number;
}

/** 풀이 목록 페이지네이션 응답. */
export interface SolutionPage {
  items: SolutionSummary[];
  page: number;
  totalPages: number;
}
