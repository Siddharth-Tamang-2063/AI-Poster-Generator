import { useCallback, useState } from "react";

/** Manages a queue of auto-dismissing toast notifications. */
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return { toasts, showToast };
}
