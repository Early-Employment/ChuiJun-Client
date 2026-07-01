import { MEMBER_TIER_LABELS } from "@/entities/member/model/member-profile";
import type { MemberProfile } from "@/entities/member/model/member-profile";
import type { HomeProfile } from "@/entities/home/model/home-profile";

// 백엔드에 홈 전용 프로필 엔드포인트가 없어 member.me 필드로 구성한다.
// 종합 랭킹은 me 응답에 없어(랭킹 엔티티 별도 조회가 필요) 레이팅으로 대체한다.
export function buildHomeProfile(profile: MemberProfile): HomeProfile {
  return {
    displayName: profile.name,
    stats: [
      { label: "레이팅", value: `${profile.rating}점` },
      { label: "푼 문제", value: `${profile.totalSolvedCount}개` },
      { label: "티어", value: MEMBER_TIER_LABELS[profile.tier] },
    ],
  };
}
