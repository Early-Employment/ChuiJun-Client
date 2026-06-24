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

- 라우팅과 페이지 로직: `app/` (Next.js App Router). 페이지 파일에 직접 작성하거나 `src/widgets/` 컴포넌트를 composition한다. `src/views/` 폴더는 만들지 않는다.
- FSD 계층: `shared → entities → features → widgets`. 상위가 하위 import.
- 같은 계층 슬라이스 간 횡단 import 금지 (원칙). 위반 시 Steiger 경고 — blocking 아님.
- Next.js의 `app/`이 FSD `views` 계층과 `app` 계층 역할을 모두 담당한다. `app/layout.tsx`가 providers·전역 초기화를 흡수 (별도 `src/app`, `src/views/` 폴더 없음).
- SVG 아이콘은 `src/shared/assets/`에 PascalCase 파일명으로 둔다 (예: `BellIcon.tsx`). 단일 슬라이스에서만 쓰이더라도 아이콘은 이 위치에 중앙화한다.
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
export { default } from "@/widgets/home/home-widget";

// ✅ 허용 — 단순 페이지
export default function HomePage() {
  return <main>...</main>;
}

// ✅ 허용 — composition
import { HomeWidget } from "@/widgets/home/home-widget";
export default function HomePage() {
  return <HomeWidget />;
}
```

## 5. mock 정책 (격리된 목 허용)

- 원칙적으로 가짜 데이터를 컴포넌트·위젯·페이지에 인라인으로 흩뿌리지 않는다.
- **백엔드 미구현으로 실데이터 흐름이 아직 없는 기능**은, 컴포넌트를 막지 않기 위해 목 데이터를 쓰되 다음을 지킨다:
  - 목은 해당 entity의 `api/*-mock.ts` **한 파일에 격리**하고, 파일명에 `mock`을 명시한다.
  - 데이터 계약(타입)과 `queryOptions` 키 팩토리(§8)를 실제 엔드포인트 기준으로 먼저 설계한다.
  - 컴포넌트·위젯은 목/실데이터를 구분하지 않는다. 데이터는 `queryOptions` 경계로만 들어온다.
  - 실데이터 전환은 `queryFn`만 `instance.get`으로 교체하는 것으로 끝나야 한다 (그 외 변경 0).
- 인증 등 계약 자체를 정의할 수 없는 작업은 여전히 **인터페이스조차 만들지 않는다.**
- 검증: `grep -rEi "mock|fake|dummy" src/ app/` 결과는 목 모듈(`src/entities/**/api/*-mock.ts`)과 이를 연결하는 키 팩토리(`api/*-keys.ts`의 `queryFn` 와이어링), 그리고 스킬 문서/주석 외 0건이어야 한다.

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
- HTTP 상태 코드는 raw 숫자(`401` 등)를 직접 비교하지 말고 **항상 axios의 `HttpStatusCode` enum**으로 처리한다 (예: `error.response?.status === HttpStatusCode.Unauthorized`).
- 비동기는 **`async`/`await`로 처리한다. Promise 체이닝(`.then()`/`.catch()`/`.finally()`) 금지** — 에러·정리 로직은 `try`/`catch`/`finally` 문으로 작성한다.
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
- 백엔드 미구현 기간에는 `queryFn`이 격리된 목(`api/*-mock.ts`)을 반환할 수 있다 (§5 참조). 실전환 시 `queryFn`만 교체한다.
- 자세한 패턴: `.agents/rules/tanstack-query/SKILL.md`.

## 9. 에러 / 로딩

- 데이터 fetch는 `useSuspenseQuery`.
- 각 컴포넌트는 `Loading` / `Error` / `Empty` 변종을 함수로 분리 후 컴파운드 정적 속성으로 연결.
- 외부에는 `<XxxBoundary>` 페어를 함께 export.
- 원형 로딩(`Spinner`)과 스켈레톤(`Skeleton`)을 적절히 사용 — 레이아웃 변화가 작은 곳에는 둘 다 사용하지 않는다.
- 자세한 패턴: `.agents/rules/error-loading/SKILL.md`.

## 10. 명령어

| 명령                | 설명                             |
| ------------------- | -------------------------------- |
| `bun run dev`       | 개발 서버                        |
| `bun run build`     | 프로덕션 빌드                    |
| `bun run start`     | 프로덕션 서버                    |
| `bun run lint`      | ESLint                           |
| `bun run lint:fsd`  | Steiger (경고만, 종료 코드 0)    |
| `bun run typecheck` | `tsc --noEmit`                   |
| `bun run check`     | typecheck + lint + lint:fsd 일괄 |
| `bun run format`    | Prettier                         |

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
