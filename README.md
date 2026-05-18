# ChuiJun-Client (취준)

한국 취준생을 위한 코딩 테스트 풀이 플랫폼.

## 시작하기

```bash
# 의존성 설치
bun install

# 환경변수 설정
cp .env.example .env.local
# .env.local 에서 NEXT_PUBLIC_API_BASE_URL 를 실제 백엔드 주소로 수정

# 개발 서버
bun run dev
```

http://localhost:3000 접속.

## 명령어

| 명령 | 설명 |
|---|---|
| `bun run dev` | 개발 서버 |
| `bun run build` | 프로덕션 빌드 |
| `bun run start` | 프로덕션 서버 |
| `bun run lint` | ESLint |
| `bun run lint:fsd` | Steiger (FSD 계층 검증 — 경고만, 종료 코드 0) |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run check` | typecheck + lint + lint:fsd 일괄 |
| `bun run format` | Prettier |

## 스택

Next.js 15 (App Router) / React 19 / TypeScript 5 / Tailwind v4 / TanStack Query 5 / axios / Steiger (FSD)

## 컨벤션

모든 컨벤션(파일명, FSD 계층, mock 금지, 디자인 토큰, 에러/로딩 패턴 등)은 [AGENTS.md](./AGENTS.md)와 `.claude/skills/`의 각 SKILL.md에 정의되어 있다. **코드 작성 전 반드시 읽을 것.**

## 디렉터리 구조

```
app/                 Next.js App Router (라우팅 진입점)
src/views/           FSD pages (Next.js 충돌 피해 rename)
src/widgets/         복합 UI 블록
src/features/        사용자 시나리오
src/entities/        비즈니스 엔티티
src/shared/          재사용 인프라
  ├── api/           axios instance + query client
  ├── config/        env 파싱
  ├── lib/           순수 유틸
  ├── providers/     QueryProvider 등
  └── ui/            QueryBoundary, Skeleton, Spinner 등 프리미티브
.claude/             Claude/Codex 하네스 (skills, hooks, settings)
```
