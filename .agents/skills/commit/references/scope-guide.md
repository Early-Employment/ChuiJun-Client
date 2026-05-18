# Commit Scope Selection Guide

## 우선순위

**FSD 계층 > app > global**

변경 위치를 보고 그 위치가 속하는 FSD 계층 이름을 그대로 scope로 쓴다. 슬라이스 밖이면 `app` 또는 `global`.

## 위치 → scope 매핑

| 변경 위치                                       | scope      |
| ----------------------------------------------- | ---------- |
| `src/shared/**`                                 | `shared`   |
| `src/entities/**`                               | `entities` |
| `src/features/**`                               | `features` |
| `src/widgets/**`                                | `widgets`  |
| `src/views/**`                                  | `views`    |
| `app/**` (Next.js App Router, layout/page)      | `app`      |
| root config, tooling, CI, `.agents/`, `.claude/`, AGENTS.md 등 | `global`   |

## 여러 계층이 함께 변경되면

가장 **상위 계층 한 곳**을 scope로 고른다 (`views > widgets > features > entities > shared`).
예: `features` + `entities`가 같이 바뀌면 `features`.
범위가 너무 넓어 자연스러운 묶음이 안 되면 커밋을 두 개로 쪼갠다.

## 잘못된 vs 올바른 예

| 잘못                                            | 올바름                                              | 이유                                             |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `feat(global): 좋아요 버튼 컴포넌트 추가`       | `feat(features): 좋아요 버튼 컴포넌트 추가`         | `src/features/problem-like/` 안의 변경            |
| `fix(src): 문제 상세 페이지 에러 처리 수정`     | `fix(views): 문제 상세 페이지 에러 처리 수정`       | `src/views/problem-detail/` 안의 변경             |
| `refactor(shared): tsconfig path alias 추가`    | `chore(global): tsconfig path alias 추가`           | 루트 설정 파일 변경                              |
| `chore(global): QueryClient 설정 분리`          | `refactor(shared): QueryClient 설정 분리`           | `src/shared/api/`에 있는 코드                    |

## `global`을 정당하게 쓸 때

```
chore(global): bun.lock 동기화
ci/cd(global): GitHub Actions workflow 추가
chore(global): .agents/rules/fsd 가이드 수정
docs(global): AGENTS.md 데이터 패칭 섹션 보강
```
