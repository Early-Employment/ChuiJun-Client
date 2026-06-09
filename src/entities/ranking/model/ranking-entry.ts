export interface RankingEntry {
  id: string;
  name: string;
  studentNumber: string;
  score: number;
  rank: number;
  isMe?: boolean;
}

export interface RankingSnapshot {
  myDelta: number;
  entries: RankingEntry[];
}
