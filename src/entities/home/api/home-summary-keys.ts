import { queryOptions } from "@tanstack/react-query";
import { createHomeSummary } from "@/entities/home/api/home-summary-mock";

export const homeSummaryKeys = {
  all: ["home", "summary"] as const,
  list: () =>
    queryOptions({
      queryKey: [...homeSummaryKeys.all] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<HomeSummaryCard[]>("/home/summary")).data,
      queryFn: async () => createHomeSummary(),
    }),
};
