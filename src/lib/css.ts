/** Lets components pass CSS custom properties through the `style` prop. */
export const vars = (values: Record<string, string>) => values as React.CSSProperties;

/** The four stages: one blue, stepping lighter, laid over the footage. */
export const stageTints = [
  "rgba(16, 27, 82, 0.52)",
  "rgba(22, 38, 111, 0.5)",
  "rgba(27, 48, 140, 0.48)",
  "rgba(33, 57, 169, 0.46)",
];

/** The mark colour that sits on those blocks. */
export const onStage = "#9FE5BC";
