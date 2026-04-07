"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageTransition, staggerContainer, staggerItem } from "./page-transition";

interface PermissionScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export function PermissionScreen({ onAllow, onSkip }: PermissionScreenProps) {
  const handleAllow = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    onAllow();
  };

  return (
    <PageTransition className="flex min-h-dvh flex-col items-center justify-center px-6">
      <motion.div
        className="flex max-w-lg flex-col items-center gap-8 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem}>
          <Bell className="size-12 text-foreground" strokeWidth={1.5} />
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={staggerItem}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            届けるために、
            <br />
            通知を許可してください。
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            毎朝1つだけ届きます。
            <br />
            それ以外は送りません。
          </p>
        </motion.div>

        <motion.div className="flex w-full flex-col gap-3" variants={staggerItem}>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAllow}
              className="h-12 w-full rounded-full text-base"
            >
              通知を許可する
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onSkip}
              variant="ghost"
              className="h-12 w-full rounded-full text-base text-muted-foreground"
            >
              あとで（通知なしで使う）
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
