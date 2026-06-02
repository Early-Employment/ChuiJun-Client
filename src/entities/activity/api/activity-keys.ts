import { queryOptions } from "@tanstack/react-query";
import { createActivity } from "@/entities/activity/api/activity-mock";

export const activityKeys = {
  all: ["activity"] as const,
  range: (from: string, to: string) =>
    queryOptions({
      queryKey: [...activityKeys.all, "range", from, to] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<ActivityDay[]>(`/activity?from=${from}&to=${to}`)).data,
      queryFn: async () => createActivity(from, to),
    }),
};
