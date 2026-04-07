"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface SettingsSheetProps {
  onClearData: () => void;
}

export function SettingsSheet({ onClearData }: SettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="設定">
            <Settings className="size-5" strokeWidth={1.5} />
          </Button>
        }
      />
      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-xl font-semibold">設定</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            アプリの設定を変更できます。
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">データ</h3>
            <Button
              variant="outline"
              className="h-12 w-full rounded-full text-base text-destructive"
              onClick={onClearData}
            >
              記録をすべて削除
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
