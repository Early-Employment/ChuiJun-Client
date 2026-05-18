# ChuiJun-Client AGENTS Guide

이 프로젝트에서 작업하는 모든 에이전트(Claude, Codex 포함)와 사람 개발자가 따라야 하는 컨벤션. 본 가이드는 초기 세팅 plan에서 확정된 결정 사항을 코드화한 것이다.

## 1. Stack

- Next.js 15 App Router, React 19, TypeScript 5
- Tailwind v4 (CSS-first `@theme`)
- TanStack Query 5 + axios
- ESLint 9 flat config + Steiger (FSD 검증, 경고만)
- Prettier (+ tailwindcss 플러그인)
- 패키지 매니저: **bun**
- 채점기: Pyodide (별도 작업에서 통합)

## 2. 디렉터리 규칙

- 라우팅: `app/`. 페이지 로직은 직접 작성하거나 `src/views/`에서 composition.
- FSD 계층: `shared → entities → features → widgets → views`. 상위가 하위 import.
- 같은 계층 슬라이스 간 횡단 import 금지 (원칙). 위반 시 Steiger 경고 — blocking 아님.
- Next.js의 `app/`는 라우팅 전용, FSD `app` 계층 역할은 `app/layout.tsx`가 흡수 (별도 `src/app` 폴더 없음).
- 경로 alias: `@/*` → `src/*`.

## 3. 파일명 규칙

- **의도가 드러나는 이름**을 사용한다. `types.ts`, `index.ts` 같이 모호한 이름 금지.
  - 예: `auth-user.ts`, `problem-list-view.tsx`, `class-names.ts`, `like-button.tsx`.
- 한 폴더 = 한 모듈/슬라이스. 슬라이스 진입점은 파일명 자체로 드러난다 (barrel `index.ts` 사용 안 함).

## 4. re-export 금지

- `export { default } from "..."`, `export * from "..."` 같은 shim 파일 금지.
- 라우트 페이지는 직접 로직을 쓰거나 named import + composition.

```tsx
// ❌ 금지
export { default } from "@/views/home/home-view";

// ✅ 허용 — 단순 페이지
export default function HomePage() {
  return <main>...</main>;
}

// ✅ 허용 — composition
import { HomeView } from "@/views/home/home-view";
export default function HomePage() {
  return <HomeView />;
}
```

## 5. mock 금지

- 가짜 데이터, 가짜 API 응답, 가짜 사용자 객체를 만들지 않는다.
- mock 생성이 불가능한 작업(예: 인증 흐름)은 **그 작업의 인터페이스조차 본 단계에서 만들지 않는다.**
- 실 데이터 흐름이 준비된 시점에만 해당 코드를 작성한다.
- 검증: `grep -rEi "mock|fake|dummy" src/ app/` 결과는 0건이어야 한다 (스킬 문서/주석은 예외).

## 6. 빈 폴더와 `.gitkeep`

- FSD 슬라이스 폴더가 아직 비어있다면 `.gitkeep`을 둔다.
- **실제 작업을 시작해 그 폴더에 코드 파일을 처음 추가하는 커밋에서 같은 커밋으로 `.gitkeep`을 삭제한다.**
- 새 슬라이스를 미리 만들고 PR을 나누는 경우, 폴더 + `.gitkeep`만 먼저 추가하는 것은 허용.

## 7. 디자인 토큰

- 색/폰트/라운드는 `app/globals.css`의 `@theme`에 정의된 토큰만 사용한다.
- hex/raw px 하드코딩 금지. 토큰이 없으면 토큰을 먼저 추가한다.
- 자세한 사용법: `.agents/rules/design-tokens/SKILL.md`.

## 8. 데이터 패칭

- 모든 HTTP 요청은 `src/shared/api/instance.ts`의 axios 인스턴스 경유.
- Query Key Factory 패턴: 각 entity가 `queryOptions` 기반 keys 모듈을 가진다.

```ts
export const problemKeys = {
  all: ["problem"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...problemKeys.all, "detail", id] as const,
      queryFn: async () => (await instance.get(`/problems/${id}`)).data,
    }),
};
```

- 좋아요 등 빠른 반응이 필요한 mutation은 Optimistic Update.
- 자세한 패턴: `.agents/rules/tanstack-query/SKILL.md`.

## 9. 에러 / 로딩

- 데이터 fetch는 `useSuspenseQuery`.
- 각 컴포넌트는 `Loading` / `Error` / `Empty` 변종을 함수로 분리 후 컴파운드 정적 속성으로 연결.
- 외부에는 `<XxxBoundary>` 페어를 함께 export.
- 원형 로딩(`Spinner`)과 스켈레톤(`Skeleton`)을 적절히 사용 — 레이아웃 변화가 작은 곳에는 둘 다 사용하지 않는다.
- 자세한 패턴: `.agents/rules/error-loading/SKILL.md`.

## 10. 명령어

| 명령 | 설명 |
|---|---|
| `bun run dev` | 개발 서버 |
| `bun run build` | 프로덕션 빌드 |
| `bun run start` | 프로덕션 서버 |
| `bun run lint` | ESLint |
| `bun run lint:fsd` | Steiger (경고만, 종료 코드 0) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run check` | typecheck + lint + lint:fsd 일괄 |
| `bun run format` | Prettier |

- **Husky 없음.** 커밋 전 사람이 직접 `bun run check`를 실행한다.
- 에이전트가 `Edit`/`Write`로 파일을 바꾸면 `.claude/hooks/`의 3개 훅이 순서대로 동작 (모두 비차단):
  1. `format.sh` — 편집된 파일만 `prettier --write`로 자동 정리.
  2. `lint.sh` — 편집된 파일만 ESLint로 검사, 경고만 출력 (자동 수정 X).
  3. `typecheck.sh` — `tsc --noEmit` 실행, 경고만 출력.

## 11. `.agents/` & `.claude/` 구조

- `.agents/`가 **단일 진실 공급원**. `.claude/skills/`는 심볼릭 링크 진입점이다.
- 두 카테고리로 나눈다:
  - `.agents/rules/<name>/SKILL.md` — 항상 적용되는 컨벤션 (design-tokens, fsd, tanstack-query, error-loading).
  - `.agents/skills/<name>/SKILL.md` — 사용자가 호출하는 액션 (commit, pull-request, skill-management).
- 파일명은 카테고리와 무관하게 항상 `SKILL.md`로 두고, frontmatter `name`은 폴더명과 일치시킨다.
- 추가·수정·삭제 절차: `.agents/skills/skill-management/SKILL.md` 참조.
- `.claude/skills/` 안에 파일을 **직접 만들지 않는다**. 항상 `.agents/`에 쓴 뒤 `ln -s`로 링크.

## 12. Codex 추가 지침

- 함수 시그니처를 변경하기 전 `rg`/`grep`으로 호출처를 확인한다.
- 변경은 작은 단위 PR. 한 PR에 여러 책임을 섞지 않는다.
- 본 파일에 정의된 규칙과 충돌하는 패턴을 코드에서 발견하면, 그 PR의 범위 밖이더라도 PR description에 메모로 남긴다 (수정은 별도 작업).
