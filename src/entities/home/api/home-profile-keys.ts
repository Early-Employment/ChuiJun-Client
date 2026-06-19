import { queryOptions } from "@tanstack/react-query";
import { createHomeProfile } from "@/entities/home/api/home-profile-mock";

export const homeProfileKeys = {
  all: ["home", "profile"] as const,
  detail: () =>
    queryOptions({
      queryKey: [...homeProfileKeys.all] as const,
      // 백엔드 미구현: 목 데이터 반환. 실전환 시 아래 한 줄로 교체한다.
      // queryFn: async () => (await instance.get<HomeProfile>("/home/profile")).data,
      queryFn: async () => createHomeProfile(),
    }),
};
