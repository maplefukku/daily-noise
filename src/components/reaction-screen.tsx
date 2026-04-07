"use client";

import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition, staggerContainer, staggerItem } from "./page-transition";

interface ReactionScreenProps {
  type: "done" | "skipped";
}

export function ReactionScreen({ type }: ReactionScreenProps) {
  const isDone = type === "done";
  const Icon = isDone ? Check : Minus;

  return (
    <PageTransition className="flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        className="flex max-w-lg flex-col items-center gap-6 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={staggerItem}
          className="flex size-16 items-center justify-center rounded-full border border-border/50"
        >
          <Icon className="size-8 text-foreground" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          className="text-xl font-semibold sm:text-2xl"
          variants={staggerItem}
        >
          {isDone ? "いいね、やってみよう。" : "了解、また明日。"}
        </motion.h1>
      </motion.div>
    </PageTransition>
  );
}
