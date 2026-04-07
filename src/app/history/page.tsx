"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, Check, Minus } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CATEGORY_LABELS } from "@/types/suggestion";
import type { ReactionLog, Category } from "@/types/suggestion";
import { PageTransition, staggerContainer, staggerItem } from "@/components/page-transition";

const STORAGE_KEY_REACTIONS = "daily-noise:reactions";

export default function HistoryPage() {
  const [reactions] = useLocalStorage<ReactionLog[]>(STORAGE_KEY_REACTIONS, []);

  const stats = useMemo(() => {
    const done = reactions.filter((r) => r.action === "done").length;
    const skipped = reactions.filter((r) => r.action === "skipped").length;
    return { done, skipped, total: reactions.length };
  }, [reactions]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, ReactionLog[]> = {};
    const sorted = [...reactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    for (const log of sorted) {
      const dateKey = log.timestamp.slice(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    }
    return groups;
  }, [reactions]);

  return (
    <PageTransition className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="戻る"
        >
          <ArrowLeft className="size-4" />
          <span>戻る</span>
        </Link>
        <h1 className="text-base font-semibold">履歴</h1>
      </header>

      <main className="flex flex-1 flex-col px-6 py-6">
        <motion.div
          className="mx-auto flex w-full max-w-lg flex-col gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Stats */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <span className="text-2xl font-semibold">{stats.total}</span>
              <span className="text-xs text-muted-foreground">合計</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <span className="text-2xl font-semibold">{stats.done}</span>
              <span className="text-xs text-muted-foreground">やった</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              <span className="text-2xl font-semibold">{stats.skipped}</span>
              <span className="text-xs text-muted-foreground">スキップ</span>
            </div>
          </motion.div>

          {/* Log list */}
          {reactions.length === 0 ? (
            <motion.div
              variants={staggerItem}
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <p className="text-muted-foreground">まだ記録がありません</p>
              <Link
                href="/"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                今日の提案を見る
              </Link>
            </motion.div>
          ) : (
            Object.entries(groupedByDate).map(([dateKey, logs]) => (
              <motion.div key={dateKey} variants={staggerItem} className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {format(new Date(dateKey), "M月d日（E）", { locale: ja })}
                </h2>
                <div className="flex flex-col gap-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          log.action === "done"
                            ? "bg-emerald-100 dark:bg-emerald-900/30"
                            : "bg-secondary"
                        }`}
                      >
                        {log.action === "done" ? (
                          <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Minus className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">
                          {CATEGORY_LABELS[log.category as Category] ?? log.category}
                        </span>
                        <span className="text-sm font-medium">
                          {log.action === "done" ? "やった" : "スキップ"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
    </PageTransition>
  );
}
