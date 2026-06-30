// GET /members/me 응답 계약. 백엔드 Swagger(GetMemberProfileResponse) 기준.
// 응답에는 grassRecord·recentActivities 도 포함되지만, 여기서는 마이페이지 프로필 카드가
// 소비하는 식별/통계 필드만 선언한다(잔디·활동은 별도 엔티티에서 다룬다).
export const MEMBER_TIERS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD"] as const;

export type MemberTier = (typeof MEMBER_TIERS)[number];

export interface MemberProfile {
  memberId: number;
  name: string;
  profileImageUrl: string;
  tier: MemberTier;
  rating: number;
  currentStreak: number;
  totalSolvedCount: number;
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
