import { createRankingSnapshot } from "@/entities/ranking/api/ranking-mock";
import { rankingCategories, type RankingCategory } from "@/entities/ranking/model/ranking-category";
import type { RankingSnapshot } from "@/entities/ranking/model/ranking-entry";
import { RankingPageWidget } from "@/widgets/ranking/ui/ranking-page-widget";

export default function RankingPage() {
  const snapshots = Object.fromEntries(
    rankingCategories.map((category) => [category.id, createRankingSnapshot(category.id)]),
  ) as Record<RankingCategory, RankingSnapshot>;

  return <RankingPageWidget snapshots={snapshots} />;
}
