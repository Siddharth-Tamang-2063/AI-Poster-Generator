import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Toolbar from "../components/Toolbar";
import CanvasArea from "../components/CanvasArea";
import { useEditorState } from "../hooks/useEditorState";
import { useCanvasInteraction } from "../hooks/useCanvasInteraction";

export default function EditorPage({ config, onBack, showToast }) {
  const { platform } = config;
  const editor = useEditorState({ config, showToast });

  useCanvasInteraction({
    canvasRef: editor.canvasRef,
    elementsRef: editor.elementsRef,
    selectedIdRef: editor.selectedIdRef,
    scaleRef: editor.scaleRef,
    setSelectedId: editor.setSelectedId,
    updateEl: editor.updateEl,
    pushHistory: editor.pushHistory,
    undo: editor.undo,
    redo: editor.redo,
    deleteSelected: editor.deleteSelected,
  });

  const selectedEl = editor.elements.find((e) => e.id === editor.selectedId) || null;

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", overflow: "hidden", position: "relative" }}>
      <LeftSidebar
        activeTemplate={editor.activeTemplate}
        onTemplateSelect={(i) => editor.applyTemplate(i, true)}
        onBack={onBack}
        onAddText={editor.addText}
        onAddShape={editor.addShape}
        onUploadImage={editor.uploadImage}
        onDelete={editor.deleteSelected}
        hasSelection={!!editor.selectedId}
      />

<Toolbar
  platform={platform}
  width={editor.canvasW}
  height={editor.canvasH}
  canUndo={editor.canUndo}
  canRedo={editor.canRedo}
  onUndo={editor.undo}
  onRedo={editor.redo}
  onReset={editor.resetTemplate}
  onDownload={editor.downloadPNG}

  scale={editor.scale}
  onZoomIn={editor.zoomIn}
  onZoomOut={editor.zoomOut}
/>

      <CanvasArea
        canvasRef={editor.canvasRef}
        canvasW={editor.canvasW}
        canvasH={editor.canvasH}
        scale={editor.scale}
      />

      <RightSidebar
  selectedEl={selectedEl}
  onUpdateProp={editor.updateSelectedProp}
  onZoomImage={editor.zoomSelectedImage}
/>
    </div>
  );
}
