"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

interface Props {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ value, onChange, readOnly = false, height = "360px" }: Props) {
  return (
    <div className="border-line overflow-hidden rounded-md border">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[python()]}
        height={height}
        editable={!readOnly}
        readOnly={readOnly}
        basicSetup={{ lineNumbers: true, highlightActiveLine: !readOnly }}
      />
    </div>
  );
}
