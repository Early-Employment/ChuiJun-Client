import type { HomeProfile } from "@/entities/home/model/home-profile";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 home-profile-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.
const HOME_PROFILE: HomeProfile = {
  displayName: "000 선생님",
  stats: [
    { label: "종합 랭킹", value: "1위" },
    { label: "푼 문제", value: "1개" },
    { label: "티어", value: "플래티넘" },
  ],
};

export function createHomeProfile(): HomeProfile {
  return HOME_PROFILE;
}
