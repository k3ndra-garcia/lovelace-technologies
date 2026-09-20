"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";

// Re-mounts on every navigation, giving each page a quiet fade-in.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }}>
      {children}
    </motion.div>
  );
}
