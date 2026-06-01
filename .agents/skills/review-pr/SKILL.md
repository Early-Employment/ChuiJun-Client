---
name: review-pr
description: PR 리뷰 코멘트를 수집하고 프로젝트 컨벤션 기준으로 각각 판정한다. 유효한 코멘트는 자동 수정 후 커밋·푸시하고, 부당한 코멘트는 반박 답글을 달며, 모호한 코멘트는 사용자에게 확인을 요청한다.
compatibility: git, gh (GitHub CLI), jq 필요
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

# review-pr

## Step 1 — PR 데이터 수집

```bash
bash .agents/skills/review-pr/scripts/get-pr-data.sh
```

출력 파일:

- `.pr-tmp/pr_comments.json` — 인라인 리뷰 코멘트 (id, path, line, body, user)
- `.pr-tmp/pr_changed_files.txt` — 변경된 파일 목록
- `.pr-tmp/pr_commits.txt` — PR에 포함된 커밋 목록
- `.pr-tmp/pr_diff.txt` — 전체 diff

레포·PR 메타데이터도 함께 확인:

```bash
gh repo view --json nameWithOwner -q .nameWithOwner
gh pr view --json number,baseRefName -q '{number: .number, base: .baseRefName}'
```

## Step 2 — 각 코멘트 판정

`pr_comments.json`의 모든 코멘트에 대해 다음 **우선순위 기준**으로 판정한다.

### 판정 기준 (우선순위 순)

1. **프로젝트 컨벤션 (1순위)**: `AGENTS.md` 및 `.agents/rules/` 하위 SKILL.md 교차 참조
   - FSD 계층 import 방향 (`shared → entities → features → widgets`)
   - 같은 계층 슬라이스 간 횡단 import 금지
   - re-export 금지 (`export { default } from`, `export * from`)
   - mock 금지 (`mock`, `fake`, `dummy` 키워드)
   - 파일명 컨벤션 (의도가 드러나는 이름, `index.ts` / `types.ts` 금지)
   - 디자인 토큰만 사용 (hex/raw px 하드코딩 금지)
   - `src/shared/api/instance.ts` axios 인스턴스 경유 필수
   - TanStack Query: `queryOptions` 기반 Query Key Factory
   - `useSuspenseQuery` 사용, `Loading`/`Error`/`Empty` 변종 분리
   - `.gitkeep` 삭제 규칙

2. **언어·프레임워크 모범 사례 (2순위)**: TypeScript 공식 가이드, React/Next.js 권고
   - 프로젝트 규칙이 없는 경우에만 적용

### 판정값

- **VALID**: 리뷰어가 맞음 → 자동 코드 수정 시도
- **INVALID**: 리뷰어가 틀림, 명확한 반박 근거 있음 → 수정 없이 반박 답글
- **PARTIAL**: 지적 의도는 맞지만 적용 방법·범위가 모호함 → 사용자에게 확인

판정 근거에는 구체적인 출처를 명시한다 (예: `AGENTS.md §4 re-export 금지`, `AGENTS.md §5 mock 금지`, `.agents/rules/design-tokens/SKILL.md`).

## Step 3 — 판정별 처리

### VALID → 자동 수정

1. Read 도구로 대상 파일 읽기
2. Edit 도구로 리뷰어 지적 사항 반영
3. 커밋 메시지는 변경된 파일의 FSD 계층을 scope로 사용:
   - `shared/` → `chore(shared): ...`
   - `entities/` → `chore(entities): ...`
   - `features/` → `chore(features): ...`
   - `widgets/` → `chore(widgets): ...`
   - `app/` → `chore(app): ...`
4. 커밋 및 푸시:
   ```bash
   git add <file>
   git commit -m "<scope>: <한국어 설명>"
   git push
   ```
5. 짧은 커밋 해시 기록 (Step 5에서 사용):
   ```bash
   git rev-parse --short HEAD
   ```

실패 시: 이유를 기록하고 PARTIAL로 폴백.

### INVALID → 건너뜀

코드를 수정하지 않는다. 반박 근거를 Step 5용으로 기록한다.

### PARTIAL → 사용자 확인

AskUserQuestion 도구로 다음을 묻는다:

```
⚠️ PARTIAL: [파일:라인] (리뷰어)
리뷰 내용: "..."
판단 근거: ...
적용하시겠습니까?
```

- `y`: VALID로 처리, 자동 수정 시도
- `n`: INVALID로 처리, 건너뜀
- `s` / 기타: PENDING으로 기록

## Step 4 — 결과 리포트 출력

```
## review-pr Results

| # | 리뷰어 | 파일 | 판정 | 근거 | 처리 |
|---|--------|------|------|------|------|
| 1 | alice | login-form.tsx:12 | ✅ VALID | AGENTS.md §4 re-export 금지 | 자동 수정 (abc1234) |
| 2 | bob | auth-user.ts:34 | ❌ INVALID | AGENTS.md §3 파일명 컨벤션 | 건너뜀 |
| 3 | alice | like-button.tsx:56 | ⚠️ PARTIAL | - | PENDING |
```

## Step 5 — GitHub 인라인 답글 게시

각 코멘트에 인라인 답글을 게시한다. 쉘 인젝션 방지를 위해 `path`와 `comment_id`는 반드시 인용한다.

**멘션 규칙**: 답글 본문 맨 앞에 리뷰어 멘션을 붙인다.

- `gemini-code-assist[bot]` → `@gemini-code-assist`
- 사람 리뷰어 → `@<username>`

```bash
gh api "repos/$REPO/pulls/$PR_NUMBER/comments/<comment_id>/replies" \
  --field body=@- <<'EOF'
@<reviewer> <답글 본문>
EOF
```

**수정 금지**: 이미 게시된 답글을 PATCH로 수정하면 리뷰어에게 알림이 가지 않는다. 내용을 바꿔야 할 경우 DELETE 후 새로 게시한다.

답글 템플릿은 `references/reply-formats.md` 참조.

## Step 6 — 정리

```bash
rm -rf .pr-tmp
```
