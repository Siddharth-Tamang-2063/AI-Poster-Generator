# PosterAI Studio

A poster/banner editor with an AI-generation landing screen and a canvas-based
design editor (drag, resize, rotate, undo/redo, templates, PNG export).

This is a multi-file reorganization of the original single-file
`PosterAIStudio.jsx` component, split by responsibility so each piece is easy
to find, read, and change independently.

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
```

## Project structure

```
src/
├── constants/
│   └── index.js              Platform presets, fonts, color tokens
├── utils/
│   ├── id.js                 uid() generator for element ids
│   └── canvas.js             wrapText, roundRect, handle geometry, hit-testing
├── canvas/
│   ├── renderElement.js      Draws shapes/text/images + the selection transformer
│   └── templates.js          The 4 starter layouts + sidebar mini-previews
├── hooks/
│   ├── useToasts.js          Toast notification queue
│   ├── useEditorState.js     Elements, history, templates, uploads, PNG export
│   └── useCanvasInteraction.js  Mouse drag/resize/rotate + keyboard shortcuts
├── components/
│   ├── Toast.jsx
│   ├── LeftSidebar.jsx       Template picker + add text/shape/image
│   ├── RightSidebar.jsx      Property inspector for the selected element
│   ├── FormControls.jsx      Shared input/select/range/color field styles
│   ├── Toolbar.jsx           Undo/redo/reset/download bar
│   └── CanvasArea.jsx        Canvas wrapper that centers + scales the design
├── pages/
│   ├── GeneratePage.jsx      Landing screen: prompt, format, fake AI generation
│   └── EditorPage.jsx        Composes the hooks + sidebar/toolbar/canvas pieces
├── App.jsx                   Page router (generate ⇄ editor) + toast host
├── main.jsx                  React DOM entry point
└── index.css                 Fonts, scrollbar, keyframes
```

## What changed from the original file

The original mouse-event wiring reassigned `canvas.onmousedown` etc. directly
inside the component's render body (`canvasRef.current && (() => {...})()`),
which re-ran every render and bypassed React's lifecycle — plus it had an
unused `CanvasEventBinder` component that was defined but never rendered.
`useCanvasInteraction` now binds those listeners properly inside a
`useEffect`, with cleanup on unmount, which is more predictable and avoids
re-attaching handlers on every render.

Everything else — layout, styling, colors, templates, and behavior — is
unchanged; this is a structural reorganization, not a redesign.
