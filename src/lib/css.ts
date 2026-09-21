/** Lets components pass CSS custom properties through the `style` prop. */
export const vars = (values: Record<string, string>) => values as React.CSSProperties;

/** The four stage blocks: one blue, stepping lighter as the work advances. */
export const stageBlocks = ["#101B52", "#16266F", "#1B308C", "#2139A9"];

/** The mark colour that sits on those blocks. */
export const onStage = "#9FE5BC";
