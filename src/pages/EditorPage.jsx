import { useState, useEffect } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Toolbar from "../components/Toolbar";
import CanvasArea from "../components/CanvasArea";
import { useEditorState } from "../hooks/useEditorState";
import { useCanvasInteraction } from "../hooks/useCanvasInteraction";

// Hook to track viewport width
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// Bottom tab bar for mobile
function MobileTabBar({ activeTab, onTabChange, hasSelection }) {
  const tabs = [
    {
      id: "templates",
      label: "Templates",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "add",
      label: "Add",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: "canvas",
      label: "Canvas",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: "properties",
      label: "Properties",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41" />
        </svg>
      ),
      badge: hasSelection,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#0f0f15",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#7c6dfa" : "rgba(255,255,255,0.4)",
              fontSize: "0.6rem",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.04em",
              position: "relative",
              transition: "color 0.15s",
            }}
          >
            {tab.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: "calc(50% - 14px)",
                  width: 6,
                  height: 6,
                  background: "#7c6dfa",
                  borderRadius: "50%",
                }}
              />
            )}
            <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
            {tab.label}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 2,
                  background: "#7c6dfa",
                  borderRadius: "0 0 2px 2px",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Slide-up panel for mobile sidebars
function MobilePanel({ isOpen, onClose, title, children }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
            backdropFilter: "blur(2px)",
          }}
        />
      )}
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 60,
          left: 0,
          right: 0,
          maxHeight: "65vh",
          background: "#13131f",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px 16px 0 0",
          zIndex: 60,
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 8,
            }}
          />
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              marginTop: 8,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 6,
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: "0.75rem",
              marginTop: 8,
            }}
          >
            Done
          </button>
        </div>
        {/* Scrollable content */}
        <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </>
  );
}

// Mobile toolbar — compact strip
function MobileToolbar({
  platform,
  width,
  height,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onDownload,
  scale,
  onZoomIn,
  onZoomOut,
  onBack,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        background: "#0f0f15",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 6,
        zIndex: 40,
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 7,
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          padding: "6px 10px",
          fontSize: "0.7rem",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
      </button>

      <span
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.4)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <strong style={{ color: "rgba(255,255,255,0.8)" }}>{platform}</strong>
        <span style={{ marginLeft: 4 }}>
          {width}×{height}
        </span>
      </span>

      {/* Zoom controls */}
      <button onClick={onZoomOut} style={iconBtnStyle}>
        −
      </button>
      <span
        style={{
          fontSize: "0.68rem",
          color: "rgba(255,255,255,0.5)",
          minWidth: 34,
          textAlign: "center",
        }}
      >
        {Math.round(scale * 100)}%
      </span>
      <button onClick={onZoomIn} style={iconBtnStyle}>
        +
      </button>

      <div
        style={{
          width: 1,
          height: 20,
          background: "rgba(255,255,255,0.1)",
          margin: "0 2px",
        }}
      />

      <button
        onClick={onUndo}
        disabled={!canUndo}
        style={{ ...iconBtnStyle, opacity: canUndo ? 1 : 0.3 }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
        </svg>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        style={{ ...iconBtnStyle, opacity: canRedo ? 1 : 0.3 }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
        </svg>
      </button>

      <button
        onClick={onDownload}
        style={{
          background: "#7c6dfa",
          border: "none",
          borderRadius: 7,
          color: "#fff",
          cursor: "pointer",
          padding: "6px 10px",
          fontSize: "0.7rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 4,
          whiteSpace: "nowrap",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        Save
      </button>
    </div>
  );
}

const iconBtnStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "rgba(255,255,255,0.6)",
  cursor: "pointer",
  padding: "5px 8px",
  fontSize: "0.78rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};

export default function EditorPage({ config, onBack, showToast }) {
  const { platform } = config;
  const isMobile = useIsMobile(768);
  const [mobileTab, setMobileTab] = useState("canvas");

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

  const selectedEl =
    editor.elements.find((e) => e.id === editor.selectedId) || null;

  // Auto-switch to properties tab when something is selected on mobile
  useEffect(() => {
    if (isMobile && selectedEl && mobileTab === "canvas") {
      // Don't auto-switch — let user stay on canvas, just show badge
    }
  }, [selectedEl, isMobile]);

  // ── DESKTOP layout ──────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
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

  // ── MOBILE layout ───────────────────────────────────────────────────────────
  const panelOpen =
    mobileTab === "templates" ||
    mobileTab === "add" ||
    mobileTab === "properties";

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a12",
        position: "relative",
      }}
    >
      {/* Top toolbar */}
      <MobileToolbar
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
        onBack={onBack}
      />

      {/* Canvas — full screen minus top bar and bottom tab bar */}
      <div
        style={{
          paddingTop: 52,
          paddingBottom: 60,
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <CanvasArea
          canvasRef={editor.canvasRef}
          canvasW={editor.canvasW}
          canvasH={editor.canvasH}
          scale={editor.scale}
        />
      </div>

      {/* Slide-up panel for Templates */}
      <MobilePanel
        isOpen={mobileTab === "templates"}
        onClose={() => setMobileTab("canvas")}
        title="Templates"
      >
        {/* Render LeftSidebar content stripped to just templates + add elements */}
        <div style={{ padding: "8px 16px 16px" }}>
          <LeftSidebar
            activeTemplate={editor.activeTemplate}
            onTemplateSelect={(i) => {
              editor.applyTemplate(i, true);
              setMobileTab("canvas");
            }}
            onBack={onBack}
            onAddText={() => {
              editor.addText();
              setMobileTab("canvas");
            }}
            onAddShape={() => {
              editor.addShape();
              setMobileTab("canvas");
            }}
            onUploadImage={(file) => {
              editor.uploadImage(file);
              setMobileTab("canvas");
            }}
            onDelete={editor.deleteSelected}
            hasSelection={!!editor.selectedId}
            mobileMode
          />
        </div>
      </MobilePanel>

      {/* Slide-up panel for Add Elements */}
      <MobilePanel
        isOpen={mobileTab === "add"}
        onClose={() => setMobileTab("canvas")}
        title="Add Elements"
      >
        <div
          style={{
            padding: "8px 16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[
            {
              label: "Upload Image",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              ),
              isUpload: true,
            },
            {
              label: "Add Text",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16M4 12h8M4 18h12" />
                </svg>
              ),
              onClick: () => {
                editor.addText();
                setMobileTab("canvas");
              },
            },
            {
              label: "Add Shape",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                </svg>
              ),
              onClick: () => {
                editor.addShape();
                setMobileTab("canvas");
              },
            },
            {
              label: "Delete Selected",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              ),
              onClick: () => {
                editor.deleteSelected();
                setMobileTab("canvas");
              },
              disabled: !selectedEl,
              danger: true,
            },
          ].map((item) =>
            item.isUpload ? (
              <label key={item.label} style={mobileActionBtn(false, false)}>
                {item.icon}
                {item.label}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    editor.uploadImage(e.target.files[0]);
                    setMobileTab("canvas");
                  }}
                />
              </label>
            ) : (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
                style={mobileActionBtn(item.danger, item.disabled)}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      </MobilePanel>

      {/* Slide-up panel for Properties */}
      <MobilePanel
        isOpen={mobileTab === "properties"}
        onClose={() => setMobileTab("canvas")}
        title={selectedEl ? `Edit ${selectedEl.type}` : "Properties"}
      >
        <RightSidebar
          selectedEl={selectedEl}
          onUpdateProp={editor.updateSelectedProp}
          onZoomImage={editor.zoomSelectedImage}
          mobileMode
        />
      </MobilePanel>

      {/* Bottom tab bar */}
      <MobileTabBar
        activeTab={mobileTab}
        onTabChange={(tab) =>
          setMobileTab(tab === mobileTab && tab !== "canvas" ? "canvas" : tab)
        }
        hasSelection={!!selectedEl}
      />
    </div>
  );
}

function mobileActionBtn(danger = false, disabled = false) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    background: danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
    border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10,
    color: disabled
      ? "rgba(255,255,255,0.2)"
      : danger
        ? "#ef4444"
        : "rgba(255,255,255,0.8)",
    fontSize: "0.85rem",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    textAlign: "left",
    opacity: disabled ? 0.5 : 1,
    boxSizing: "border-box",
  };
}
