#!/usr/bin/env bash
# Edit/Write 직후 편집된 파일을 ESLint로 검사 — 자동 수정하지 않고 경고만 stderr로 출력.
# stdin으로 Claude Code가 넘기는 tool_input.file_path만 처리.

set +e
cd "$(dirname "$0")/../.."

if ! command -v bun >/dev/null 2>&1; then
  exit 0
fi

PAYLOAD=$(cat 2>/dev/null)
FILE_PATH=""

if command -v jq >/dev/null 2>&1 && [ -n "$PAYLOAD" ]; then
  FILE_PATH=$(printf '%s' "$PAYLOAD" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
fi

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs)
    ;;
  *)
    exit 0
    ;;
esac

OUTPUT=$(bun x eslint "$FILE_PATH" 2>&1)
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "⚠️  eslint 경고: $FILE_PATH" >&2
  echo "$OUTPUT" | tail -30 >&2
fi

exit 0
