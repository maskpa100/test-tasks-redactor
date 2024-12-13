import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor/CodeEditor";
import { fetchMock } from "./api/fetchMock";
import s from "./App.module.scss";
import { IoIosPlayCircle } from "react-icons/io";
import { FaCopy } from "react-icons/fa";

type CodeResult = {
  status: "success" | "error";
  result: string | number;
};

const App: React.FC = () => {
  const [code, setCode] = useState(
    "const number = 8 \nconsole.log( number + 89 )"
  );
  const [language, setLanguage] = useState<string>("javascript");
  const [codeResult, setCodeResult] = useState<CodeResult | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleRun = () => {
    setCodeResult(null);

    if (language === "javascript") {
      try {
        let output = "";
        const originalLog = console.log;
        console.log = (message: any) => {
          output += message + "\n";
        };
        eval(code);
        console.log = originalLog;
        handleSuccess(output);
      } catch (error: unknown) {
        handleError(error);
      }
    } else {
      fetchMock(language, code)
        .then((response) => response.json())
        .then((data) => handleSuccess(data.output))
        .catch((error) => handleError(error));
    }
  };

  const handleSuccess = (result: string | number) => {
    setCodeResult({ status: "success", result });
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    setCodeResult({ status: "error", result: errorMessage });
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert("Текст скопирован в буфер обмена!");
      })
      .catch((error) => {
        alert("Не удалось скопировать: " + error);
      });
  };

  return (
    <div className={s.app}>
      <h1>Code Editor</h1>
      <div className={s.descriptions}>
        <span>Задания:</span>
        <p>
          Создайте переменную number, которая будет хранить значение 8. Затем
          выведите результат сложения этой переменной с числом 89 в консоль.
        </p>
        <span>Требования:</span>
        <p>
          Используйте const для создания переменной number. В консоль должно
          выводиться число 97 (результат сложения 8 и 89).
        </p>
      </div>

      <div className={s.language}>
        <button className={s.copy} onClick={handleCopy}>
          <FaCopy />
          Copy
        </button>
        <select value={language} onChange={handleChange}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
        </select>
      </div>
      <CodeEditor
        language={language}
        initialCode={code}
        onCodeChange={(newCode) => setCode(newCode)}
      />
      <div className={s.run}>
        <button className={s.run} onClick={handleRun}>
          <IoIosPlayCircle />
          Run
        </button>
      </div>
      {codeResult !== null && (
        <div className={s.codeResult}>
          <div
            className={`${s.title} ${
              codeResult?.status === "success" ? s.success : s.error
            }`}>
            {codeResult?.status === "success" ? "Выполнено" : "Ошибка"}
          </div>
          <pre>{codeResult?.result}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
