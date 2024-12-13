import React, { useState } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import s from "./CodeEditor.module.scss";

interface CodeEditorProps {
  language: string;
  theme?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  theme = "vs-dark",
  initialCode = "",
  onCodeChange,
}) => {
  const [code, setCode] = useState(initialCode);

  const handleChange: OnChange = (value) => {
    setCode(value || "");
    if (onCodeChange) {
      onCodeChange(value || "");
    }
  };

  return (
    <Editor
      className={s.editor}
      language={language}
      defaultValue={initialCode}
      theme={theme}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        tabSize: 4,
        formatOnType: true,
        formatOnPaste: true,
      }}
    />
  );
};

export default CodeEditor;
