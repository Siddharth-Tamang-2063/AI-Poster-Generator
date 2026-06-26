import { COLORS } from "../constants";

export default function CanvasArea({ canvasRef, canvasW, canvasH, scale }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        // Checkerboard pattern so transparent areas are visible
        backgroundImage: `
          linear-gradient(45deg, #13131a 25%, transparent 25%),
          linear-gradient(-45deg, #13131a 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #13131a 75%),
          linear-gradient(-45deg, transparent 75%, #13131a 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        paddingTop: 52,
        overflow: "auto",
        position: "relative",
        minWidth: 0, // prevents flex overflow
      }}
    >
      {/* Centered canvas wrapper with consistent padding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          minHeight: "100%",
          minWidth: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            flexShrink: 0,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5), 0 32px 80px rgba(0,0,0,0.4)",
            borderRadius: 2,
            width: canvasW * scale,
            height: canvasH * scale,
            transition: "width 0.2s ease, height 0.2s ease",
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}