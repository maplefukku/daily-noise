"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, staggerContainer, staggerItem } from "./page-transition";
import { SettingsSheet } from "./settings-sheet";
import type { TodaySuggestion } from "@/types/suggestion";
import { CATEGORY_LABELS } from "@/types/suggestion";

interface SuggestionScreenProps {
  suggestion: TodaySuggestion;
  onDone: () => void;
  onSkip: () => void;
  onClearData: () => void;
}

export function SuggestionScreen({
  suggestion,
  onDone,
  onSkip,
  onClearData,
}: SuggestionScreenProps) {
  const today = format(new Date(), "M月d日（E）", { locale: ja });

  return (
    <PageTransition className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl">
        <h1 className="text-base font-semibold">デイリーノイズ</h1>
        <SettingsSheet onClearData={onClearData} />
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <motion.div
          className="flex w-full max-w-lg flex-col gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.p
            className="text-sm text-muted-foreground"
            variants={staggerItem}
          >
            {today}
          </motion.p>

          <motion.div variants={staggerItem}>
            <Card className="rounded-2xl border border-border/50 p-6 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-0">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[suggestion.category]}
                </span>
                <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
                  {suggestion.title}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {suggestion.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="flex flex-col gap-3" variants={staggerItem}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onDone}
                className="h-12 w-full rounded-full text-base"
              >
                やってみる
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onSkip}
                variant="outline"
                className="h-12 w-full rounded-full text-base"
              >
                今日はスキップ
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </PageTransition>
  );
}
