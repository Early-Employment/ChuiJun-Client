// 랭킹 표/시상대가 소비하는 한 줄. 백엔드 단일 랭킹(/members/rankings)에서 파생한다.
// 카테고리·증감은 백엔드에 없어 제거했다. 개인 학번도 없어 학년/반 라벨로 대체한다.
export interface RankingEntry {
  /** memberId. isMe 판정과 key 로 쓴다. */
  id: number;
  /** 전체 정렬 순위(1부터). */
  rank: number;
  name: string;
  /** 학년/반 라벨. 예: "3-1" (개인 번호는 백엔드 미제공) */
  classLabel: string;
  /** 통합 점수 = rating. */
  score: number;
  /** 로그인한 본인 여부. */
  isMe: boolean;
}
