import { createRankingSnapshot } from "@/entities/ranking/api/ranking-mock";
import { rankingCategories } from "@/entities/ranking/model/ranking-category";
import type { RankingSnapshot } from "@/entities/ranking/model/ranking-entry";
import { RankingPageWidget } from "@/widgets/ranking/ui/ranking-page-widget";

export default function RankingPage() {
  const snapshots: Record<(typeof rankingCategories)[number]["id"], RankingSnapshot> =
    Object.fromEntries(
    rankingCategories.map((category) => [category.id, createRankingSnapshot(category.id)]),
    ) as Record<(typeof rankingCategories)[number]["id"], RankingSnapshot>;

  return <RankingPageWidget snapshots={snapshots} />;
}
