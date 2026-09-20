/** Lets components pass CSS custom properties through the `style` prop. */
export const vars = (values: Record<string, string>) => values as React.CSSProperties;

/** The ink family. Keys match the CSS tokens in globals.css. */
export type Ink = "blue" | "plum" | "teal" | "brass" | "oxblood";

/** Deep variants, for blocks of colour carrying paper-coloured text. */
export const block: Record<Ink, string> = {
  blue: "#1A3173",
  plum: "#3F2354",
  teal: "#134A43",
  brass: "#64400D",
  oxblood: "#5E1A24",
};

/** Light variants, for marks sitting on those blocks. */
export const onBlock: Record<Ink, string> = {
  blue: "#9DB1F0",
  plum: "#C6A9DC",
  teal: "#86C9BD",
  brass: "#DCB878",
  oxblood: "#E6A3A9",
};
