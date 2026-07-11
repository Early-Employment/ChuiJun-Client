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
