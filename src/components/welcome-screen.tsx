"use client";

import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageTransition, staggerContainer, staggerItem } from "./page-transition";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <PageTransition className="flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        className="flex max-w-lg flex-col items-center gap-8 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={staggerItem}
        >
          <Coffee className="size-12 text-foreground" strokeWidth={1.5} />
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={staggerItem}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            選ばなくていい。
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            毎日1つ、試すことが届く。
            <br />
            やるかどうかは、5秒で。
          </p>
        </motion.div>

        <motion.div
          className="w-full"
          variants={staggerItem}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            className="h-12 w-full rounded-full text-base"
          >
            はじめる
          </Button>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
