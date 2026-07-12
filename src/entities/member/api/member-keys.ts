import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { createMockMemberClassroom } from "@/entities/member/api/member-classroom-mock";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  UpdateProfileImageRequest,
} from "@/entities/member/api/profile-image-upload";
import type { MemberProfile } from "@/entities/member/model/member-profile";

export const memberKeys = {
  all: ["member"] as const,
  // GET /members/me — 인증 토큰으로 내 대시보드 프로필을 조회한다(memberId 불필요).
  me: () =>
    queryOptions({
      queryKey: [...memberKeys.all, "me"] as const,
      queryFn: async () => (await instance.get<MemberProfile>("/members/me")).data,
    }),
  // /members/me 가 아직 학년·반을 안 줘서 목으로 채운다(§5). 실전환 시 queryFn 만 교체.
  myClassroom: () =>
    queryOptions({
      queryKey: [...memberKeys.all, "my-classroom"] as const,
      queryFn: async () => createMockMemberClassroom(),
    }),
  // 프로필 이미지 수정 mutation. presigned URL 발급 → S3 업로드 → 최종 URL 확정 3단계.
  // 확정된 profileImageUrl 을 반환한다.
  updateProfileImage: () => ({
    mutationKey: [...memberKeys.all, "update-profile-image"] as const,
    mutationFn: async (file: File): Promise<string> => {
      // 1. 업로드용 presigned URL 과 최종 이미지 URL 을 발급받는다.
      const { data } = await instance.post<PresignedUrlResponse>(
        "/members/me/profile-image/presigned-url",
        { fileName: file.name } satisfies PresignedUrlRequest,
      );

      // 2. S3 에 파일 바이트를 직접 PUT 업로드한다. 백엔드 API 가 아닌 외부 스토리지이므로
      //    /api 프록시·Authorization 을 붙이는 axios instance 를 우회한다.
      const uploadResponse = await fetch(data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadResponse.ok) {
        throw new Error("프로필 이미지 업로드에 실패했습니다.");
      }

      // 3. 업로드된 이미지 URL 을 내 프로필로 확정한다.
      await instance.put("/members/me/profile-image", {
        profileImageUrl: data.profileImageUrl,
      } satisfies UpdateProfileImageRequest);

      return data.profileImageUrl;
    },
  }),
};
