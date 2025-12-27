import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";

interface ProductivityContextType {
  totalTime: number;
  currentToolTime: number;
  currentTool: string | null;
  setCurrentTool: (tool: string | null) => void;
  formatTime: (seconds: number) => string;
  resetTimer: () => void;
  showBreakReminder: boolean;
  dismissBreakReminder: () => void;
}

const ProductivityContext = createContext<ProductivityContextType | undefined>(undefined);

const FOCUS_INTERVAL = 25 * 60; // 25 minutes in seconds
const BREAK_REMINDER_INTERVAL = 45 * 60; // 45 minutes

export function ProductivityProvider({ children }: { children: ReactNode }) {
  const [totalTime, setTotalTime] = useState(0);
  const [currentToolTime, setCurrentToolTime] = useState(0);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [lastBreakReminder, setLastBreakReminder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime((prev) => prev + 1);
      if (currentTool) {
        setCurrentToolTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTool]);

  // Focus reminder every 25 minutes
  useEffect(() => {
    if (currentToolTime > 0 && currentToolTime % FOCUS_INTERVAL === 0 && currentTool) {
      toast.info("🧘 Focus Check", {
        description: "You've been focused for 25 minutes. Great work! Consider a quick stretch.",
        duration: 5000,
      });
    }
  }, [currentToolTime, currentTool]);

  // Break reminder every 45 minutes
  useEffect(() => {
    if (totalTime - lastBreakReminder >= BREAK_REMINDER_INTERVAL && totalTime > 0) {
      setShowBreakReminder(true);
      setLastBreakReminder(totalTime);
    }
  }, [totalTime, lastBreakReminder]);

  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const resetTimer = useCallback(() => {
    setCurrentToolTime(0);
  }, []);

  const dismissBreakReminder = useCallback(() => {
    setShowBreakReminder(false);
  }, []);

  return (
    <ProductivityContext.Provider
      value={{
        totalTime,
        currentToolTime,
        currentTool,
        setCurrentTool,
        formatTime,
        resetTimer,
        showBreakReminder,
        dismissBreakReminder,
      }}
    >
      {children}
    </ProductivityContext.Provider>
  );
}

export function useProductivity() {
  const context = useContext(ProductivityContext);
  if (!context) {
    throw new Error("useProductivity must be used within a ProductivityProvider");
  }
  return context;
}
