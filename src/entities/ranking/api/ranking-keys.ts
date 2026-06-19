import { queryOptions } from "@tanstack/react-query";
import { createRankingSnapshot, createRankingSnapshots } from "@/entities/ranking/api/ranking-mock";
import type { RankingCategory } from "@/entities/ranking/model/ranking-category";

export const rankingKeys = {
  all: ["ranking"] as const,
  snapshots: () =>
    queryOptions({
      queryKey: [...rankingKeys.all, "snapshots"] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<Record<RankingCategory, RankingSnapshot>>("/rankings")).data,
      queryFn: async () => createRankingSnapshots(),
    }),
  category: (category: RankingCategory) =>
    queryOptions({
      queryKey: [...rankingKeys.all, "category", category] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<RankingSnapshot>(`/rankings/${category}`)).data,
      queryFn: async () => createRankingSnapshot(category),
    }),
};
