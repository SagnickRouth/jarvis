"use client";

import { motion } from "framer-motion";
import type { AssistantState } from "@/types";

const config: Record<AssistantState, { scale: number; color: string; pulse: number }> = {
  idle:      { scale: 1,    color: "#0077ff", pulse: 2 },
  listening: { scale: 1.15, color: "#00ff88", pulse: 0.6 },
  thinking:  { scale: 1.05, color: "#00d4ff", pulse: 1 },
  speaking:  { scale: 1.2,  color: "#00d4ff", pulse: 0.4 },
  executing: { scale: 1.1,  color: "#ffaa00", pulse: 0.8 },
};

export function Orb({ state }: { state: AssistantState }) {
  const c = config[state];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <motion.div
        animate={{
          scale: [c.scale * 1.3, c.scale * 1.5, c.scale * 1.3],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: c.pulse * 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full"
        style={{ background: `radial-gradient(circle, ${c.color}22, transparent 70%)` }}
      />
      {/* Inner orb */}
      <motion.div
        animate={{
          scale: [c.scale, c.scale * 1.08, c.scale],
        }}
        transition={{ duration: c.pulse, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${c.color}cc, ${c.color}33, transparent 70%)`,
          boxShadow: `0 0 40px ${c.color}66, 0 0 80px ${c.color}22`,
        }}
      />
    </div>
  );
}
