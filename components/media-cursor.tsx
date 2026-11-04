"use client";

import { useEffect, useRef } from "react";

/**
 * The pink eye that follows the pointer over imagery.
 *
 * Only elements marked `data-media-cursor` summon it; the native pointer is
 * hidden on those elements in CSS. Position is eased toward the real pointer
 * on an animation frame rather than pinned to it, which is what makes it feel
 * like it is trailing you. Pointer-fine devices only, and it never mounts for
 * keyboard or touch users.
 */
export function MediaCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursor.current;
    if (!el) return;

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let visible = false;

    const render = () => {
      // Ease 22% of the remaining distance each frame.
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${visible ? 1 : 0.4})`;
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!frame) {
        x = targetX;
        y = targetY;
        frame = requestAnimationFrame(render);
      }

      const media = event.target instanceof Element
        ? event.target.closest("[data-media-cursor]")
        : null;
      const nextVisible = Boolean(media);

      if (nextVisible !== visible) {
        visible = nextVisible;
        el.dataset.visible = String(visible);
      }
    };

    const onLeave = () => {
      if (!visible) return;
      visible = false;
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={cursor} className="media-cursor" data-visible="false" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        width={16}
        height={16}
        aria-hidden="true"
      >
        <path
          d="M21.5298 11.1188C16.6909 2.62714 7.30917 2.62704 2.47032 11.1187C2.15898 11.665 2.15898 12.3348 2.47032 12.8811C7.30917 21.3728 16.6909 21.3729 21.5298 12.8812C21.8411 12.3349 21.8411 11.6652 21.5298 11.1188Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.25 12C15.25 13.7949 13.7949 15.25 12 15.25C10.2051 15.25 8.75 13.7949 8.75 12C8.75 10.2051 10.2051 8.75 12 8.75C13.7949 8.75 15.25 10.2051 15.25 12Z"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
