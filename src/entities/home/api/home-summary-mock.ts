import type { HomeSummaryCard } from "@/entities/home/model/home-summary";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 home-summary-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.
const HOME_SUMMARY_CARDS: HomeSummaryCard[] = [
  { eyebrow: "오늘의 문제", title: "서현이의 이준건 전화번호 구하기", meta: "그리디" },
  { eyebrow: "최신 문제", title: "이준건의 서현 전번 구하기 2", meta: "그리디" },
  { eyebrow: "나의 실시간 순위", title: "1위", meta: "종합 랭킹" },
  { eyebrow: "이어서 풀기", title: "서현이의 이준건 전화번호 구하기", meta: "그리디" },
];

export function createHomeSummary(): HomeSummaryCard[] {
  return HOME_SUMMARY_CARDS;
}
