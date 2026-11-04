"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "portfolio:sound";

/**
 * Sound is off until you ask for it, and it never downloads an audio file:
 * every tick is synthesised with Web Audio, so the page stays as light as it
 * was. Enabling it adds a quiet blip when a link or button is hovered and a
 * slightly lower one on press — the same feedback the reference uses.
 *
 * If you later drop real samples into /public/sound, swap `tick()` for an
 * <audio> or AudioBufferSourceNode; the toggle and the listeners stay as-is.
 */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const lastPlayed = useRef(0);

  useEffect(() => {
    setReady(true);
    try {
      setEnabled(window.localStorage.getItem(STORAGE_KEY) === "on");
    } catch {
      /* storage unavailable — stay off */
    }
  }, []);

  const tick = useCallback((frequency: number, duration = 0.055) => {
    const ctx = context.current;
    if (!ctx || ctx.state === "suspended") return;

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.35,
      now + duration
    );

    // Deliberately quiet: a texture, not an event.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.022, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (!context.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      context.current = new AudioContextClass();
    }

    const ctx = context.current;
    void ctx.resume();

    const onHover = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("a, button, [data-media-cursor]")
          : null;
      if (!target) return;

      const now = performance.now();
      if (now - lastPlayed.current < 90) return;
      lastPlayed.current = now;
      tick(1180);
    };

    const onPress = () => tick(720, 0.08);

    document.addEventListener("pointerover", onHover, { passive: true });
    document.addEventListener("pointerdown", onPress, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onHover);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [enabled, tick]);

  const toggle = () => {
    setEnabled((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (next && context.current) void context.current.resume();
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound effects off" : "Turn sound effects on"}
      title={enabled ? "Sound effects on" : "Sound effects off"}
      data-ready={ready}
      className="sound-toggle"
    >
      {enabled ? (
        <Volume2 size={15} strokeWidth={1.6} />
      ) : (
        <VolumeX size={15} strokeWidth={1.6} />
      )}
    </button>
  );
}
