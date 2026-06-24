import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import type { MemberProfile } from "@/entities/member/model/member-profile";

export const memberKeys = {
  all: ["member"] as const,
  // GET /members/me — 인증 토큰으로 내 대시보드 프로필을 조회한다(memberId 불필요).
  me: () =>
    queryOptions({
      queryKey: [...memberKeys.all, "me"] as const,
      queryFn: async () => (await instance.get<MemberProfile>("/members/me")).data,
    }),
};
