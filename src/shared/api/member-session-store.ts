import type { MemberRole } from "@/shared/api/dg-login-response";

// 로그인(DgLoginResponse) 시 받은 식별 정보. accessToken 과 함께 sessionStorage 에 둔다.
// memberId 는 teacherId/studentId/requestorId 쿼리 파라미터와 랭킹 isMe 판정에 쓰이고,
// role 은 학급 화면의 교사/학생 분기에 쓰인다. (백엔드 /members/me 응답에 role 이 없어 로그인 시 보관)
const MEMBER_ID_KEY = "memberId";
const MEMBER_ROLE_KEY = "memberRole";

export function getMemberId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(MEMBER_ID_KEY);
  return raw === null ? null : Number(raw);
}

// 백엔드가 대소문자를 문서(STUDENT/TEACHER/ADMIN)와 다르게 내려주는 경우가 있어(§api-spec-divergence),
// 저장된 값을 그대로 캐스팅하지 않고 대문자로 정규화해 반환한다. 교사/학생 분기가 이 값에 의존한다.
export function getMemberRole(): MemberRole | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(MEMBER_ROLE_KEY);
  return raw === null ? null : (raw.toUpperCase() as MemberRole);
}

export function setMemberSession(memberId: number, role: MemberRole): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MEMBER_ID_KEY, String(memberId));
  window.sessionStorage.setItem(MEMBER_ROLE_KEY, role);
}

export function clearMemberSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(MEMBER_ID_KEY);
  window.sessionStorage.removeItem(MEMBER_ROLE_KEY);
}
