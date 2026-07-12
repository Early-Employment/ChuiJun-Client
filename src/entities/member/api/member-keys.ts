import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import {
  toSameOriginUrl,
  type PresignedUrlRequest,
  type PresignedUrlResponse,
  type UpdateProfileImageRequest,
} from "@/entities/member/api/profile-image-upload";
import type { MemberProfile } from "@/entities/member/model/member-profile";

export const memberKeys = {
  all: ["member"] as const,
  // GET /members/me — 인증 토큰으로 내 대시보드 프로필을 조회한다(memberId 불필요).
  me: () =>
    queryOptions({
      queryKey: [...memberKeys.all, "me"] as const,
      queryFn: async () => {
        const { data } = await instance.get<MemberProfile>("/members/me");
        // 과거에 저장된 local-upload 절대 URL도 표시 시점에 same-origin 경로로 정규화한다.
        return { ...data, profileImageUrl: toSameOriginUrl(data.profileImageUrl) };
      },
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

      // 2. 파일 바이트를 PUT 업로드한다. 백엔드 API 가 아닌 외부 스토리지(S3)이므로
      //    /api 프록시·Authorization 을 붙이는 axios instance 를 우회한다.
      // 로컬/개발 환경은 S3 대신 백엔드 자체의 "/api/local-upload/*" 가 대신하는데, 이
      // 엔드포인트는 CORS 설정이 없어 절대 URL로 직접 요청하면 막히고(브라우저 CORS 차단),
      // multipart/form-data(`file` 필드)만 받는다. same-origin 경로로 바꾸고 폼으로 보낸다.
      const uploadUrl = toSameOriginUrl(data.presignedUrl);
      const isLocalUpload = uploadUrl !== data.presignedUrl;

      const uploadResponse = isLocalUpload
        ? await fetch(uploadUrl, {
            method: "PUT",
            body: (() => {
              const formData = new FormData();
              formData.append("file", file);
              return formData;
            })(),
          })
        : await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });
      if (!uploadResponse.ok) {
        throw new Error("프로필 이미지 업로드에 실패했습니다.");
      }

      // 3. 업로드된 이미지 URL 을 내 프로필로 확정한다.
      const profileImageUrl = toSameOriginUrl(data.profileImageUrl);
      await instance.put("/members/me/profile-image", {
        profileImageUrl,
      } satisfies UpdateProfileImageRequest);

      return profileImageUrl;
    },
  }),
};
