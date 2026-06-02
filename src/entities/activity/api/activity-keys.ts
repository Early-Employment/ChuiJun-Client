import { queryOptions } from "@tanstack/react-query";
import { createMockActivity, createMonthlyActivity } from "@/entities/activity/api/activity-mock";

export const activityKeys = {
  all: ["activity"] as const,
  range: (days: number) =>
    queryOptions({
      queryKey: [...activityKeys.all, "range", days] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ActivityDay[]>(`/activity?days=${days}`)).data,
      queryFn: async () => createMockActivity(days),
    }),
  month: (year: number, month: number) =>
    queryOptions({
      queryKey: [...activityKeys.all, "month", year, month] as const,
      // queryFn: async () => (await instance.get<ActivityDay[]>(`/activity?year=${year}&month=${month}`)).data,
      queryFn: async () => createMonthlyActivity(year, month),
    }),
};
