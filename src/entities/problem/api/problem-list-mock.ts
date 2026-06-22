import type { ProblemListItem } from "@/entities/problem/model/problem-list-item";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 problem-keys.ts 의 list queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.
const PROBLEM_LIST: ProblemListItem[] = [
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "해결함",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
  },
];

export function createProblemList(): ProblemListItem[] {
  return PROBLEM_LIST;
}
