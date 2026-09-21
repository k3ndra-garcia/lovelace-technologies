"use client";

import { useEffect, useRef } from "react";

const CELL = 13; // grid pitch in CSS pixels
const RADIUS = 185; // how far the lens reaches
const EASE = 0.14; // how quickly the lens follows the pointer

/**
 * The copy occupies the left of the hero, where the mask is strongest. The lens
 * fades out across that zone so punched holes can never sit behind the
 * headline and cost it contrast.
 */
const copyFade = (x: number, width: number) =>
  Math.min(1, Math.max(0.05, (x / width - 0.34) / 0.28));

/**
 * A reading head for the hero footage: the video is sampled and punched back
 * out as holes wherever the pointer is, using the same grid as the mark.
 * Pointer devices only, and skipped under reduced motion.
 */
export function HeroCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    if (!canvas || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Small offscreen buffer the footage is sampled into each frame.
    const sample = document.createElement("canvas");
    sample.width = 192;
    sample.height = 108;
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;

    const styles = getComputedStyle(document.documentElement);
    const light = styles.getPropertyValue("--on-color").trim() || "#ECEFF3";
    const brand = styles.getPropertyValue("--brand").trim() || "#8AA4F2";

    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, ex: -9999, ey: -9999, strength: 0, target: 0 };
    let raf = 0;
    let frame: ImageData | null = null;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const media = () => hero.querySelector<HTMLVideoElement | HTMLImageElement>(".hero__video");

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      pointer.ex += (pointer.x - pointer.ex) * EASE;
      pointer.ey += (pointer.y - pointer.ey) * EASE;
      pointer.strength += (pointer.target - pointer.strength) * 0.08;

      const el = media();
      if (el && pointer.strength > 0.01) {
        try {
          sampleCtx.drawImage(el, 0, 0, sample.width, sample.height);
          frame = sampleCtx.getImageData(0, 0, sample.width, sample.height);
        } catch {
          // A frame that isn't ready yet: keep the previous sample.
        }
      }

      if (frame && pointer.strength > 0.01) {
        const reach = RADIUS * pointer.strength;
        const minX = Math.max(0, Math.floor((pointer.ex - reach) / CELL));
        const maxX = Math.min(Math.ceil(width / CELL), Math.ceil((pointer.ex + reach) / CELL));
        const minY = Math.max(0, Math.floor((pointer.ey - reach) / CELL));
        const maxY = Math.min(Math.ceil(height / CELL), Math.ceil((pointer.ey + reach) / CELL));

        for (let gy = minY; gy < maxY; gy++) {
          for (let gx = minX; gx < maxX; gx++) {
            const cx = gx * CELL + CELL / 2;
            const cy = gy * CELL + CELL / 2;
            const dist = Math.hypot(cx - pointer.ex, cy - pointer.ey);
            if (dist > reach) continue;

            // Soft falloff from the centre of the lens.
            const falloff = Math.cos((dist / reach) * Math.PI * 0.5) ** 1.4;

            const sx = Math.min(sample.width - 1, Math.max(0, Math.round((cx / width) * sample.width)));
            const sy = Math.min(sample.height - 1, Math.max(0, Math.round((cy / height) * sample.height)));
            const i = (sy * sample.width + sx) * 4;
            const bright =
              (frame.data[i] * 0.2126 + frame.data[i + 1] * 0.7152 + frame.data[i + 2] * 0.0722) / 255;

            const size = CELL * 0.78 * falloff * (0.5 + bright * 0.95);
            if (size < 0.4) continue;

            ctx.fillStyle = bright > 0.5 ? light : brand;
            ctx.globalAlpha = Math.min(1, falloff * (0.55 + bright * 0.75) * copyFade(cx, width));
            ctx.beginPath();
            ctx.roundRect(cx - size / 2, cy - size * 0.72, size, size * 1.44, size * 0.3);
            ctx.fill();
          }
        }
        // A hairline ring marks the edge of the reading head.
        ctx.globalAlpha = 0.5 * pointer.strength * copyFade(pointer.ex, width);
        ctx.strokeStyle = brand;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.ex, pointer.ey, reach * 0.94, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const settling =
        Math.abs(pointer.target - pointer.strength) > 0.002 ||
        Math.abs(pointer.x - pointer.ex) > 0.5 ||
        Math.abs(pointer.y - pointer.ey) > 0.5;

      if (pointer.strength > 0.01 || settling) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && pointer.target === 0) {
        // Start the lens where the pointer entered, not where it last was.
        pointer.ex = x;
        pointer.ey = y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.target = inside ? 1 : 0;
      kick();
    };

    const onLeave = () => {
      pointer.target = 0;
      kick();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__lens" aria-hidden="true" />;
}
