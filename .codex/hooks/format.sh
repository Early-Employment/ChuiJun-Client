#!/usr/bin/env bash
# Edit/Write 직후 편집된 파일을 prettier --write로 자동 포맷.
# stdin으로 Claude Code가 넘기는 tool_input.file_path만 처리해 작업 범위 밖 파일은 건드리지 않는다.

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
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.md|*.css|*.html|*.yml|*.yaml)
    ;;
  *)
    exit 0
    ;;
esac

OUTPUT=$(bun x prettier --write "$FILE_PATH" 2>&1)
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "⚠️  prettier 실패: $FILE_PATH" >&2
  echo "$OUTPUT" | tail -10 >&2
fi

exit 0
