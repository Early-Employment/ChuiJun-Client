#!/usr/bin/env bash
# Edit/Write 직후 가벼운 typecheck — 실패해도 차단하지 않고 경고만 stderr로 출력.
# 빠른 피드백 용도이며 정식 검증은 사람이 `bun run check`로 실행.

set +e
cd "$(dirname "$0")/../.."

if ! command -v bun >/dev/null 2>&1; then
  exit 0
fi

OUTPUT=$(bun run typecheck 2>&1)
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "⚠️  typecheck 경고:" >&2
  echo "$OUTPUT" | tail -20 >&2
fi

exit 0
