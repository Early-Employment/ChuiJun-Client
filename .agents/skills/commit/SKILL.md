---
name: commit
description: ChuiJun-Client 컨벤션에 맞게 변경 사항을 논리 단위로 쪼개 Git 커밋을 만든다. FSD 계층 기준 scope를 사용한다.
allowed-tools: Bash
---

# Commit

`bun run check`로 통과 가능한 상태에서 호출한다고 가정한다. 실패 시 사용자에게 알리고 멈춘다.

## Step 0 — 브랜치 확인

```bash
git branch --show-current
```

- 현재 브랜치가 `main`이면 사용자에게 작업 브랜치 사용을 권장만 한다(차단하지는 않는다). 사용자가 `main` 직접 커밋을 명시한 경우 그대로 진행.
- 브랜치를 새로 따야 할 때 이름 규칙: `<type>/<kebab-case-description>` 예: `feat/problem-like-button`, `fix/auth-redirect-loop`, `refactor/query-boundary`.

## Commit 메시지 규칙

형식: `type(scope): 한국어 설명`

- **Types** (영어 소문자):
  `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf` / `ci/cd`
- **Scope** (영어 소문자): FSD 계층 또는 routing/전역.
  - FSD: `shared` / `entities` / `features` / `widgets` / `views`
  - Next 라우팅 변경: `app`
  - root config, tooling, CI, 환경설정 등 슬라이스 밖: `global`
  - 자세한 선택 규칙: `references/scope-guide.md`
- **설명** (한국어): 마침표 없음, 다음 어미 금지 — `~한다/~된다`, `~하기/~하기 위해`, `~합니다/~됩니다`, `~했습니다`.
  - 좋은 예: `좋아요 버튼 컴포넌트 추가`, `로그인 리다이렉트 무한 루프 수정`, `QueryBoundary 분리`
- subject line만 작성한다. body 추가 금지.
- AI 도구를 co-author로 추가하지 않는다.

## Commit 흐름

1. `git status`, `git diff`로 변경 사항을 파악한다.
2. 논리 단위로 그룹핑한다 (기능 추가 / 버그 수정 / 리팩터링 / 토큰 추가 / 컨벤션 문서 등은 분리).
3. 각 그룹마다:
   - 관련 파일만 `git add <file>...`로 staging.
   - 규칙에 맞는 메시지로 `git commit -m "<message>"`.
4. `git log --oneline -n <count>`로 결과 확인.

## 금지

- 한 커밋에 여러 책임 묶기 (`feat + refactor + docs` 혼합 금지).
- `git add -A` / `git add .` — sensitive 파일이나 의도 외 파일이 들어갈 수 있다. 항상 파일을 명시.
- `mock`/`fake`/`dummy` 데이터를 추가하는 커밋. `AGENTS.md §5` 위반.
- `index.ts`, `types.ts` 같은 모호한 이름 파일 추가. `AGENTS.md §3` 위반.
