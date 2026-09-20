import { box, cage, p as pt, quad, route, seg, slot } from "@/lib/iso";

// The element in each drawing that lifts when its panel is hovered.
const FLOAT = "iso__float";

const Face = ({ d }: { d: string }) => <path className="iso__face" d={d} />;
const Edge = ({ d }: { d: string }) => <path className="iso__edge" d={d} />;
const Soft = ({ d }: { d: string }) => <path className="iso__soft" d={d} />;
const Slot = ({ d }: { d: string }) => <path className="iso__slot" d={d} />;

const faces = (args: Parameters<typeof box>) =>
  box(...args).map((d, i) => <Face key={i} d={d} />);

/** A deck of cards, the top one lifting clear with its slots cut. */
function AiEnablement() {
  return (
    <>
      {faces([-46, -40, -30, 92, 76, 4])}
      {faces([-42, -36, -22, 92, 76, 4])}
      {faces([-38, -32, -14, 92, 76, 4])}
      <g className={FLOAT} transform="translate(6 -48)">
        {faces([-38, -32, 0, 92, 76, 4])}
        {[0, 1, 2, 3].map((i) => (
          <Slot key={`a${i}`} d={slot(-26 + i * 18, -20, 4)} />
        ))}
        {[0, 1, 2].map((i) => (
          <Slot key={`b${i}`} d={slot(-17 + i * 18, 2, 4)} />
        ))}
      </g>
    </>
  );
}

/** A configured system on its plate, the next card feeding into the slot. */
function SoftwareImplementation() {
  return (
    <>
      {faces([-58, -52, -14, 116, 104, 6])}
      {faces([-26, -24, -8, 58, 50, 40])}
      <Face d={quad(-18, -6, 32, 42, 12)} />
      <g className={FLOAT} transform="translate(0 -46)">
        {faces([-26, -24, 32, 58, 50, 4])}
        <Slot d={slot(-14, -12, 36)} />
        <Slot d={slot(2, -12, 36)} />
        <Slot d={slot(-14, 12, 36)} />
      </g>
    </>
  );
}

/** The record cabinet, one drawer drawn open for inspection. */
function TechnologyAudits() {
  return (
    <>
      {faces([-34, -30, -58, 68, 60, 92])}
      {[0, 1, 2].map((i) => (
        <Soft key={i} d={seg(pt(-34, 30, -44 + i * 22), pt(34, 30, -44 + i * 22))} />
      ))}
      <g className={FLOAT}>
        {faces([-28, 30, -30, 56, 26, 18])}
        <Slot d={slot(-4, 44, -12)} />
        {faces([-18, 36, -12, 36, 3, 20])}
      </g>
    </>
  );
}

/** Work held solid inside a frame of rules. */
function GovernanceCompliance() {
  const posts: [number, number][] = [
    [-56, -50],
    [56, -50],
    [56, 50],
    [-56, 50],
  ];
  return (
    <>
      {cage(-56, -50, -44, 112, 100, 88).map((d, i) => (
        <Soft key={i} d={d} />
      ))}
      {posts.map(([x, y], i) => (
        <Edge key={`post${i}`} d={seg(pt(x, y, -44), pt(x, y, -28))} />
      ))}
      <g className={FLOAT}>
        {faces([-20, -18, -44, 40, 36, 30])}
        <Slot d={slot(-4, -2, -14)} />
      </g>
    </>
  );
}

/** The route set out on the plan sheet: turns marked, destination punched. */
function TechnologyStrategy() {
  const pts: [number, number][] = [
    [-44, 34],
    [-44, -6],
    [-6, -6],
    [-6, -34],
    [30, -34],
  ];
  return (
    <>
      {faces([-60, -50, -8, 120, 100, 5])}
      {route(pts, -3).map((d, i) => (
        <Edge key={i} d={d} />
      ))}
      {pts.slice(1, -1).map(([x, y], i) => (
        <Slot key={`t${i}`} d={slot(x - 2.5, y - 4.5, -3)} />
      ))}
      <g className={FLOAT}>
        {faces([24, -40, -3, 14, 12, 26])}
        <Slot d={slot(28.5, -36, 23)} />
      </g>
    </>
  );
}

const drawings: Record<string, { art: () => React.JSX.Element; shift: string }> = {
  "ai-enablement": { art: AiEnablement, shift: "translate(0 44)" },
  "software-implementation": { art: SoftwareImplementation, shift: "translate(0 54)" },
  "technology-audits": { art: TechnologyAudits, shift: "translate(10 22)" },
  "governance-compliance": { art: GovernanceCompliance, shift: "translate(0 18)" },
  "technology-strategy": { art: TechnologyStrategy, shift: "translate(0 26)" },
};

export function ServiceGraphic({ slug }: { slug: string }) {
  const drawing = drawings[slug];
  if (!drawing) return null;
  const Art = drawing.art;
  return (
    <svg className="iso" viewBox="-150 -150 300 330" fill="none" aria-hidden="true">
      <g transform={drawing.shift}>
        <Art />
      </g>
    </svg>
  );
}
