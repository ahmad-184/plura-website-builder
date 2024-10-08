"use client";

import { motion } from "framer-motion";

export default function AnimateFadeIn({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}
