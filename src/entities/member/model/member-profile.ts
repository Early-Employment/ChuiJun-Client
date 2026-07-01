// GET /members/me 응답 계약. 백엔드 Swagger(GetMemberProfileResponse) 기준.
export const MEMBER_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD"] as const;

export type MemberTier = (typeof MEMBER_TIERS)[number];

/** 잔디밭 일별 기록 한 건. activity 엔티티가 히트맵·달력으로 가공해 소비한다. */
export interface GrassRecord {
  /** ISO 날짜 (yyyy-mm-dd) */
  date: string;
  solvedCount: number;
  studySeconds: number;
}

/** 최근 활동(제출) 한 건. */
export interface RecentActivity {
  submissionId: number;
  problemTitle: string;
  problemLevel: number;
  score: number;
  /** 제출 일시 ISO 문자열. */
  submittedAt: string;
}

export interface MemberProfile {
  memberId: number;
  name: string;
  profileImageUrl: string;
  tier: MemberTier;
  rating: number;
  currentStreak: number;
  totalSolvedCount: number;
  /** 일별 학습 통계(잔디밭 기록). */
  grassRecord: GrassRecord[];
  /** 최근 활동 기록 리스트(최대 4개). */
  recentActivities: RecentActivity[];
}

export const MEMBER_TIER_LABELS: Record<MemberTier, string> = {
  BRONZE: "브론즈",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
  EMERALD: "에메랄드",
};

// 티어별 대표 색 유틸 클래스. globals.css @theme 의 --color-tier-* 토큰과 1:1 대응한다.
// (Tailwind 가 소스에서 리터럴 클래스명을 스캔하므로 전체 문자열로 둔다.)
export const MEMBER_TIER_COLOR_CLASSES: Record<MemberTier, { text: string; background: string }> = {
  BRONZE: { text: "text-tier-bronze", background: "bg-tier-bronze" },
  SILVER: { text: "text-tier-silver", background: "bg-tier-silver" },
  GOLD: { text: "text-tier-gold", background: "bg-tier-gold" },
  PLATINUM: { text: "text-tier-platinum", background: "bg-tier-platinum" },
  EMERALD: { text: "text-tier-emerald", background: "bg-tier-emerald" },
};
