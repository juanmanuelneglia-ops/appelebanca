"use client";

import { useEffect } from "react";

/** Quita la burbuja N / Issue del modo desarrollo (sobre todo en iPhone). */
export function HideNextDevBadge() {
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll("nextjs-portal").forEach((el) => {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
        (el as HTMLElement).setAttribute("hidden", "");
      });
    };

    hide();
    const obs = new MutationObserver(hide);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    const id = window.setInterval(hide, 1000);
    return () => {
      obs.disconnect();
      window.clearInterval(id);
    };
  }, []);

  return null;
}
