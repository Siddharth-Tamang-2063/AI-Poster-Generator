import { useState } from "react";
import GeneratePage from "./pages/GeneratePage";
import EditorPage from "./pages/EditorPage";
import Toast from "./components/Toast";
import { useToasts } from "./hooks/useToasts";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("generate"); // "generate" | "editor"
  const [editorConfig, setEditorConfig] = useState(null);
  const { toasts, showToast } = useToasts();

  const handleGenerate = (config) => {
    setEditorConfig(config);
    setPage("editor");
  };

  const handleBack = () => {
    setPage("generate");
    setEditorConfig(null);
  };

  return (
    <>
      {page === "generate" && <GeneratePage onGenerate={handleGenerate} />}
      {page === "editor" && editorConfig && (
        <EditorPage config={editorConfig} onBack={handleBack} showToast={showToast} />
      )}
      <Toast toasts={toasts} />
    </>
  );
}
