import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getMemberId } from "@/shared/api/member-session-store";
import { mapRankingEntries } from "@/entities/ranking/api/ranking-api-mapper";
import type { MemberRankingPageResponse } from "@/entities/ranking/api/ranking-api-response";

// 백엔드는 페이지네이션 단일 랭킹만 제공한다. 시상대·내 순위·표 정렬은 클라이언트에서
// 한 번에 다루므로, 상위 구간을 한 페이지로 받아 위젯이 자체 페이징한다.
const RANKING_PAGE_SIZE = 100;

export const rankingKeys = {
  all: ["ranking"] as const,
  list: () =>
    queryOptions({
      queryKey: [...rankingKeys.all, "list"] as const,
      queryFn: async () => {
        const { data } = await instance.get<MemberRankingPageResponse>("/members/rankings", {
          params: { page: 0, size: RANKING_PAGE_SIZE, sort: "rating,desc" },
        });
        return mapRankingEntries(data, getMemberId());
      },
    }),
};
