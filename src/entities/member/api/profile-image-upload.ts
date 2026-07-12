// 프로필 이미지 업로드 API 계약. 백엔드 Swagger 기준.
// 흐름: presigned URL 발급 → S3 직접 PUT 업로드 → 최종 URL 확정.

/** POST /members/me/profile-image/presigned-url 요청. */
export interface PresignedUrlRequest {
  /** 확장자를 포함한 파일 이름. */
  fileName: string;
}

/** POST /members/me/profile-image/presigned-url 응답. */
export interface PresignedUrlResponse {
  /** S3 임시 파일 업로드 URL. 이 URL 로 파일 바이트를 직접 PUT 한다. */
  presignedUrl: string;
  /** 업로드 완료 후 프로필로 확정할 최종 이미지 URL. */
  profileImageUrl: string;
}

/** PUT /members/me/profile-image 요청. profileImageUrl 은 최대 500자. */
export interface UpdateProfileImageRequest {
  profileImageUrl: string;
}

const LOCAL_UPLOAD_PATH_MARKER = "/api/local-upload/";

/**
 * 로컬/개발 환경은 실제 S3 대신 백엔드 자체가 `/api/local-upload/*` 로 파일을 직접 서빙한다.
 * 이 경로는 백엔드에 CORS 설정이 없어 브라우저가 절대 URL로 직접(cross-origin) 요청하면 막힌다.
 * next.config.ts 의 same-origin 프록시를 타도록 오리진을 떼고 경로만 남긴다.
 * 실제 S3 presigned URL(운영 환경, 자체 CORS 설정 보유)은 그대로 반환한다.
 */
export function toSameOriginUrl(url: string): string {
  if (!url.includes(LOCAL_UPLOAD_PATH_MARKER)) return url;
  return new URL(url).pathname;
}
