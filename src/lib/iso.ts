// A minimal isometric toolkit for the service graphics: 30° projection, line
// art only. Objects are built from the same vocabulary — card stock, slots,
// plates and cabinets — so the five drawings read as one family.

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

export type Pt = [number, number];

/** Projects a point in the isometric space onto the drawing plane. */
export const p = (x: number, y: number, z: number): Pt => [(x - y) * C, (x + y) * S - z];

const n = (v: number) => v.toFixed(2);

export const poly = (pts: Pt[]) => `M${pts.map((pt) => `${n(pt[0])} ${n(pt[1])}`).join("L")}Z`;

export const seg = (a: Pt, b: Pt) => `M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`;

/** The three visible faces of a cuboid, back to front. */
export function box(x: number, y: number, z: number, w: number, d: number, h: number): string[] {
  const top: Pt[] = [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  const right: Pt[] = [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)];
  const front: Pt[] = [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)];
  return [front, right, top].map(poly);
}

/** All twelve edges of a cuboid, nothing filled. */
export function cage(x: number, y: number, z: number, w: number, d: number, h: number): string[] {
  const c: Pt[] = [
    p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z),
    p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h),
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  return edges.map(([a, b]) => seg(c[a], c[b]));
}

/** A punched slot lying on a horizontal plane — the only solid in the set. */
export const slot = (x: number, y: number, z: number, w = 5, d = 9) =>
  poly([p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)]);

/** A flat quad, used for recesses and sheets. */
export const quad = (x: number, y: number, z: number, w: number, d: number) =>
  poly([p(x, y, z), p(x + w, y, z), p(x + w, y + d, z), p(x, y + d, z)]);

/** A run of straight segments across a horizontal plane. */
export const route = (pts: [number, number][], z: number) =>
  pts.slice(1).map((pt, i) => seg(p(pts[i][0], pts[i][1], z), p(pt[0], pt[1], z)));
