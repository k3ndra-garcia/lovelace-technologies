"use client";

import { useEffect, useRef } from "react";

type Grid = { cols: number; rows: number; cells: string[] };

type PunchCardProps = {
  grid: Grid;
  className?: string;
  /** Delay before the reader starts punching, in seconds. */
  delay?: number;
  /** Seconds for the reader to travel the full card. */
  duration?: number;
  label: string;
};

type Layout = {
  cols: number;
  rows: number;
  /** How much of the silhouette covers each cell, 0–1. */
  cover: number[][];
  padX: number;
  padTop: number;
  cellW: number;
  cellH: number;
  holeW: number;
  holeH: number;
  holeR: number;
  dot: number;
};

// Holes below this width turn to mush, so smaller cards use a coarser grid.
const MIN_HOLE_PX = 2.2;
// Cells with less coverage than this stay unpunched.
const INK_THRESHOLD = 0.2;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A punched card rendered to canvas. Holes punch in row by row, like a card
 * passing through a reader, and together they form the Lovelace profile.
 * Holes near the pointer take on the accent colour.
 */
export function PunchCard({ grid, className, delay = 0.6, duration = 1.9, label }: PunchCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Read from the card itself so light blocks (.on-paper) resolve correctly.
    const styles = getComputedStyle(wrap);
    const color = (name: string) => styles.getPropertyValue(name).trim();
    const palette = {
      card: color("--card"),
      ink: color("--ink"),
      accent: color("--accent"),
      rule: color("--rule-strong"),
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let layout: Layout | null = null;
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };
    const start = performance.now() + delay * 1000;
    let raf = 0;
    let visible = true;

    // Deterministic jitter so each hole punches at a slightly different moment.
    const jitter = (r: number, c: number) => {
      const x = Math.sin((r * 91 + c) * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    /**
     * Collapses the source grid by `step` so holes never fall below
     * MIN_HOLE_PX; a merged cell averages the coverage of its sources.
     */
    const buildLayout = (): Layout => {
      const padX = width * 0.075;
      const padTop = height * 0.1;
      const padBottom = height * 0.06;
      const rawCellW = (width - padX * 2) / grid.cols;
      const step = Math.max(1, Math.ceil(MIN_HOLE_PX / (rawCellW * 0.7)));

      const cols = Math.ceil(grid.cols / step);
      const rows = Math.ceil(grid.rows / step);
      const cover: number[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: number[] = [];
        for (let c = 0; c < cols; c++) {
          let sum = 0;
          let total = 0;
          for (let sr = r * step; sr < Math.min((r + 1) * step, grid.rows); sr++) {
            for (let sc = c * step; sc < Math.min((c + 1) * step, grid.cols); sc++) {
              total++;
              sum += parseInt(grid.cells[sr][sc], 16) / 15;
            }
          }
          row.push(total > 0 ? sum / total : 0);
        }
        cover.push(row);
      }

      const cellW = (width - padX * 2) / cols;
      const cellH = (height - padTop - padBottom) / rows;
      const holeW = cellW * 0.7;
      const holeH = Math.min(cellH * 0.86, holeW * 1.4);
      return {
        cols,
        rows,
        cover,
        padX,
        padTop,
        cellW,
        cellH,
        holeW,
        holeH,
        holeR: Math.min(holeW, holeH) * 0.3,
        dot: Math.max(1, Math.min(2, cellW * 0.16)),
      };
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      layout = buildLayout();
    };

    const draw = (now: number) => {
      if (!layout) return;
      const L = layout;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Card with the clipped top-left corner of a classic punched card.
      const cut = Math.min(width, height) * 0.09;
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(cut, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, cut);
      ctx.closePath();
      ctx.fillStyle = palette.card;
      ctx.fill();

      const elapsed = reduce ? Infinity : (now - start) / 1000;
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      const scanRow = progress * (L.rows + 2) - 1;

      pointer.strength += (pointer.target - pointer.strength) * 0.12;
      const reach = Math.max(width, height) * 0.2;

      const speck = (cx: number, cy: number) => {
        ctx.fillStyle = palette.rule;
        ctx.globalAlpha = 0.45;
        ctx.fillRect(cx - L.dot / 2, cy - L.dot / 2, L.dot, L.dot);
        ctx.globalAlpha = 1;
      };

      for (let r = 0; r < L.rows; r++) {
        for (let c = 0; c < L.cols; c++) {
          const cx = L.padX + L.cellW * (c + 0.5);
          const cy = L.padTop + L.cellH * (r + 0.5);

          const cover = L.cover[r][c];
          if (cover < INK_THRESHOLD) {
            speck(cx, cy);
            continue;
          }

          // Partly covered cells punch smaller, which tapers the edges.
          const fill = 0.5 + 0.5 * Math.min(1, (cover - INK_THRESHOLD) / (0.85 - INK_THRESHOLD));

          // Punch timing follows the reader head down the card.
          const t = reduce ? 1 : Math.max(0, Math.min(1, (scanRow - r + jitter(r, c) * 0.8) / 1.4));
          if (t <= 0) {
            speck(cx, cy);
            continue;
          }

          const s = easeOut(t);
          const dist = Math.hypot(pointer.x - cx, pointer.y - cy);
          const near = reduce ? 0 : Math.max(0, 1 - dist / reach) * pointer.strength;

          ctx.fillStyle =
            near > 0.02 ? mix(palette.ink, palette.accent, Math.min(1, near * 1.6)) : palette.ink;
          const w = L.holeW * s * fill;
          const h = L.holeH * s * fill;
          ctx.beginPath();
          ctx.roundRect(cx - w / 2, cy - h / 2, w, h, L.holeR * s * fill);
          ctx.fill();
        }
      }

      // Reader head while the card is being punched.
      if (!reduce && progress > 0 && progress < 1) {
        const y = L.padTop + L.cellH * Math.max(0, scanRow + 0.5);
        if (y < height - height * 0.06) {
          ctx.fillStyle = palette.accent;
          ctx.globalAlpha = 0.9 * Math.sin(progress * Math.PI);
          ctx.fillRect(L.padX * 0.4, y, width - L.padX * 0.8, 1.5);
          ctx.globalAlpha = 1;
        }
      }

      const settling = Math.abs(pointer.target - pointer.strength) > 0.001;
      if (visible && (progress < 1 || settling || pointer.target > 0)) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      const inside =
        pointer.x > -40 &&
        pointer.y > -40 &&
        pointer.x < rect.width + 40 &&
        pointer.y < rect.height + 40;
      pointer.target = inside ? 1 : 0;
      kick();
    };

    const onLeave = () => {
      pointer.target = 0;
      kick();
    };

    resize();
    kick();

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(wrap);

    if (!reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [grid, delay, duration]);

  return (
    <div ref={wrapRef} className={className} role="img" aria-label={label}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function mix(a: string, b: string, amount: number) {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const ch = (i: number) => Math.round(pa[i] + (pb[i] - pa[i]) * amount);
  return `rgb(${ch(0)} ${ch(1)} ${ch(2)})`;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
