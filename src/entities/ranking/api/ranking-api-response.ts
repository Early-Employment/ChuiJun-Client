import type { MemberTier } from "@/entities/member/model/member-profile";

// GET /members/rankings 응답 계약. 백엔드 Swagger(PageGetMemberRankingResponse) 기준.
// 백엔드는 카테고리 없는 단일 랭킹 페이지만 제공한다(증감·개인 학번 없음).
export interface MemberRankingResponse {
  memberId: number;
  name: string;
  profileImageUrl: string;
  tier: MemberTier;
  rating: number;
  grade: number;
  classNum: number;
  totalSolvedCount: number;
}

export interface MemberRankingPageResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: MemberRankingResponse[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
