// Shared motion tokens. Timing studied from the reference: fast, critically
// damped springs; ease-out arrivals; ~0.08s stagger steps.

export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const spring = { type: "spring", stiffness: 400, damping: 65, mass: 1 } as const;

export const duration = {
  fast: 0.2,
  base: 0.45,
  slow: 0.9,
} as const;

export const stagger = 0.08;
