import type { MemberRankingPageResponse } from "@/entities/ranking/api/ranking-api-response";
import type { RankingEntry } from "@/entities/ranking/model/ranking-entry";

// 순위는 rating 내림차순으로 직접 정렬해 매긴다.
// (백엔드가 sort 파라미터를 항상 보장하지 않아, 정렬을 신뢰하지 않고 클라이언트에서 확정한다.)
// 같은 memberId 가 중복으로 내려오는 경우 첫 항목만 남겨 시상대·표 중복 노출을 막는다.
export function mapRankingEntries(
  page: MemberRankingPageResponse,
  myMemberId: number | null,
): RankingEntry[] {
  const seen = new Set<number>();

  return [...page.content]
    .sort((left, right) => right.rating - left.rating)
    .filter((entry) => {
      if (seen.has(entry.memberId)) return false;
      seen.add(entry.memberId);
      return true;
    })
    .map((entry, index) => ({
      id: entry.memberId,
      rank: index + 1,
      name: entry.name,
      classLabel: `${entry.grade}-${entry.classNum}`,
      score: entry.rating,
      isMe: entry.memberId === myMemberId,
    }));
}
