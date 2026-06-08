export const rankingCategories = [
  { id: "overall", label: "종합 랭킹" },
  { id: "consistency", label: "꾸준함 랭킹" },
  { id: "growth", label: "성장 랭킹" },
  { id: "grade-overall", label: "학년 종합 랭킹" },
  { id: "class-overall", label: "반 종합 랭킹" },
] as const;

export type RankingCategory = (typeof rankingCategories)[number]["id"];
