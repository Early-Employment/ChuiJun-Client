---
name: pull-request
description: 현재 브랜치의 변경 사항을 정리해 PR을 생성한다. develop 브랜치 여부와 워킹트리 상태에 따라 릴리즈 PR 또는 피처 PR을 생성한다. ChuiJun-Client 컨벤션을 따른다.
allowed-tools: Bash
---

# Pull Request

사용자가 현재 브랜치로 PR을 만들고 싶을 때 사용.

## 전제 확인

1. 레포 상태 확인:
   - `git status -sb`
   - `git branch --show-current`
   - `git remote -v`
2. GitHub CLI 확인:
   - `gh --version`
   - `gh auth status`
3. `gh` 미설치/미인증이거나 remote가 GitHub 아니면 중단하고 사용자에게 알린다.

## 브랜치/diff 규칙

1. 현재 브랜치가 `main`이면 중단. 사용자에게 작업 브랜치 생성을 요청.
2. **현재 브랜치가 `develop`인 경우**:
   - `git status -sb` 결과가 clean(변경 사항 없음) → **릴리즈 PR** (`develop` → `main`)
   - 워킹트리에 변경 사항이 있음 → **피처 PR** (`develop` → `main`)
   - 릴리즈 PR 컨텍스트: `git log origin/main..HEAD --oneline`, `git diff origin/main...HEAD --stat`
3. 그 외 브랜치: **피처 PR** (target branch: `develop`)
   - 피처 PR 컨텍스트: `git log origin/develop..HEAD --oneline 2>/dev/null || git log --oneline -15`
   - `git diff origin/develop...HEAD --stat 2>/dev/null || git diff HEAD~5...HEAD --stat`
   - `git diff origin/develop...HEAD 2>/dev/null || git diff HEAD~5...HEAD`
4. 워킹트리에 PR과 무관한 변경이 있으면 PR에 포함시키지 않고 사용자에게 묻는다.

## 제목 규칙

형식: `[scope] 한국어 설명`

- 허용 scope (소문자):
  - `[shared]` / `[entities]` / `[features]` / `[widgets]`
  - `[app]` — Next App Router 라우팅/레이아웃
  - `[global]` — 루트 설정, tooling, 컨벤션 문서, `.agents/`, `.claude/`
  - `[ci/cd]` — GitHub Actions, 배포 파이프라인 전용
  - `[release]` — 릴리즈 PR 전용 (`develop` → `main`)
- 변경 범위에 가장 좁게 맞는 scope 사용. 릴리즈 PR은 항상 `[release]` 사용.
- 식별자(파일명/심볼)는 backtick.
- 이모지 금지.

## 본문 규칙

PR template이 없으니 다음 구조 사용:

```md
## 개요

<1~3문장 요약>

## 작업 사항

<무엇을 어떻게 왜 바꿨는지>
```

- 실제 diff와 commit 기록을 근거로 작성. 파일 나열만 하지 않는다.
- 한국어 `~하였습니다` 격식체.
- 이모지 금지.
- 식별자(파일명/심볼)는 backtick.
- 전체 본문 2500자 이내.
- 의도가 diff에서 명확하지 않으면 사용자에게 짧게 되묻는다 (추측으로 메우지 않는다).

## 생성 흐름

1. 브랜치 + diff 컨텍스트 확인.
2. 위 규칙으로 title과 body 생성.
3. body는 실제 개행이 들어간 임시 Markdown 파일에 쓴다.
4. 생성 직전 title + body preview를 사용자에게 보여준다.
5. 다음 스크립트로 draft PR 생성. 피처 PR은 `develop`, 릴리즈 PR은 `main`을 base로 사용:

```bash
# 피처 PR (기본)
bash ".agents/skills/pull-request/scripts/create-pull-request.sh" "<title>" "<body-file>" "develop"

# 릴리즈 PR (develop 브랜치에서 생성 시)
bash ".agents/skills/pull-request/scripts/create-pull-request.sh" "<title>" "<body-file>" "main"
```

6. 사용자가 명시적으로 다른 base를 요청하면 세 번째 인자에 그 브랜치 이름.
7. 생성 후 PR URL, title, base branch를 사용자에게 보고.

## 안전 규칙

- 본문 헤딩(`## 개요`, `## 작업 사항`)을 변형하지 않는다.
- 제목 형식 `[scope] 한국어 설명`을 어기지 않는다. scope는 허용 목록 이외 사용 금지.
- 본문 2500자 한도 초과 금지.
- `main`에서 PR 생성 금지.
- `develop`에서 릴리즈 PR을 생성할 때 scope는 반드시 `[release]`.
- 사용자가 명시적으로 요청하지 않으면 ready-for-review로 만들지 않는다 (항상 draft).
