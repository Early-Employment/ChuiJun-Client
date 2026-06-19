import type { RankingCategory } from "@/entities/ranking/model/ranking-category";
import type { RankingEntry, RankingSnapshot } from "@/entities/ranking/model/ranking-entry";

const baseStudents = [
  ["박서현", "3105"],
  ["김민준", "3201"],
  ["이수아", "3307"],
  ["정하율", "3402"],
  ["최도윤", "3509"],
  ["한지민", "3604"],
  ["윤서진", "3703"],
  ["임주원", "3808"],
  ["강민서", "3906"],
  ["오지후", "3002"],
  ["송채은", "3108"],
  ["배현우", "3204"],
  ["홍예린", "3303"],
  ["서태윤", "3406"],
  ["문가은", "3501"],
  ["000", "담당"],
] as const;

const rankingSeeds: Record<RankingCategory, RankingSnapshot> = {
  overall: {
    myDelta: -99,
    entries: createEntries({
      categoryPrefix: "overall",
      startScore: 1540,
      scoreStep: 37,
      meIndex: 15,
    }),
  },
  consistency: {
    myDelta: -12,
    entries: createEntries({
      categoryPrefix: "consistency",
      startScore: 96,
      scoreStep: 3,
      meIndex: 10,
    }),
  },
  growth: {
    myDelta: 18,
    entries: createEntries({
      categoryPrefix: "growth",
      startScore: 420,
      scoreStep: 18,
      meIndex: 6,
    }),
  },
  "grade-overall": {
    myDelta: -31,
    entries: createEntries({
      categoryPrefix: "grade-overall",
      startScore: 1320,
      scoreStep: 29,
      meIndex: 11,
    }),
  },
  "class-overall": {
    myDelta: 7,
    entries: createEntries({
      categoryPrefix: "class-overall",
      startScore: 880,
      scoreStep: 22,
      meIndex: 4,
    }),
  },
};

function createEntries({
  categoryPrefix,
  startScore,
  scoreStep,
  meIndex,
}: {
  categoryPrefix: string;
  startScore: number;
  scoreStep: number;
  meIndex: number;
}): RankingEntry[] {
  return baseStudents.map(([name, studentNumber], index) => ({
    id: `${categoryPrefix}-${studentNumber}-${index + 1}`,
    name,
    studentNumber,
    score: Math.max(0, startScore - index * scoreStep),
    rank: index + 1,
    isMe: index === meIndex,
  }));
}

export function createRankingSnapshot(category: RankingCategory): RankingSnapshot {
  return rankingSeeds[category];
}

export function createRankingSnapshots(): Record<RankingCategory, RankingSnapshot> {
  return rankingSeeds;
}
