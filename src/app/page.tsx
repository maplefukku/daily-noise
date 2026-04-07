"use client";

import { AnimatePresence } from "framer-motion";
import { useAppState } from "@/hooks/use-app-state";
import { WelcomeScreen } from "@/components/welcome-screen";
import { PermissionScreen } from "@/components/permission-screen";
import { SuggestionScreen } from "@/components/suggestion-screen";
import { ReactionScreen } from "@/components/reaction-screen";

export default function Home() {
  const {
    currentScreen,
    suggestion,
    showPermission,
    dismissPermission,
    react,
    clearAllData,
  } = useAppState();

  return (
    <AnimatePresence mode="wait">
      {currentScreen === "welcome" && (
        <WelcomeScreen key="welcome" onStart={showPermission} />
      )}
      {currentScreen === "permission" && (
        <PermissionScreen
          key="permission"
          onAllow={dismissPermission}
          onSkip={dismissPermission}
        />
      )}
      {currentScreen === "suggestion" && suggestion && (
        <SuggestionScreen
          key="suggestion"
          suggestion={suggestion}
          onDone={() => react("done")}
          onSkip={() => react("skipped")}
          onClearData={clearAllData}
        />
      )}
      {currentScreen === "done" && (
        <ReactionScreen key="done" type="done" />
      )}
      {currentScreen === "skipped" && (
        <ReactionScreen key="skipped" type="skipped" />
      )}
    </AnimatePresence>
  );
}
