import type { MemberClassroom } from "@/entities/member/model/member-classroom";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 member-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
const MOCK_MEMBER_CLASSROOM: MemberClassroom = {
  classLabel: "3학년 1반",
};

export function createMockMemberClassroom(): MemberClassroom {
  return MOCK_MEMBER_CLASSROOM;
}
