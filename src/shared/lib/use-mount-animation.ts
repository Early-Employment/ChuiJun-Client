"use client";

import { useEffect, useState } from "react";

/**
 * open=false 로 바뀌어도 즉시 unmount하지 않고 exit keyframe(`data-state="closed"`)을
 * 재생한 뒤, 그 keyframe의 onAnimationEnd에서 실제로 unmount한다.
 */
export function useMountAnimation(open: boolean) {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) setShouldRender(true);
  }, [open]);

  return {
    shouldRender,
    dataState: (open ? "open" : "closed") as "open" | "closed",
    handleAnimationEnd: () => {
      if (!open) setShouldRender(false);
    },
  };
}
