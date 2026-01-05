"use client";

import { ChevronDown, Swords, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AnalysisMode = "headToHead" | "landscape";

interface ModeSelectorProps {
  currentMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  brands: string[];
  selectedBrand1?: string | null;
  selectedBrand2?: string | null;
  onBrand1Change?: (brand: string) => void;
  onBrand2Change?: (brand: string | null) => void;
}

export function ModeSelector({
  currentMode,
  onModeChange,
  brands,
  selectedBrand1,
  selectedBrand2,
  onBrand1Change,
  onBrand2Change,
}: ModeSelectorProps) {
  const getModeLabel = () => {
    switch (currentMode) {
      case "headToHead":
        return (
          <>
            <Swords className="h-4 w-4 text-orange-500" />
            <span className="font-medium">
              {selectedBrand1} vs {selectedBrand2}
            </span>
          </>
        );
      case "landscape":
        return (
          <>
            <Globe className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Market Landscape</span>
          </>
        );
    }
  };

  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="gap-2">
        {getModeLabel()}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="p-2">
          {/* Mode Header */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            📊 Analysis Mode
          </div>

          {/* Market Landscape - First Option */}
          <div className="py-1">
            <button
              className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                currentMode === "landscape"
                  ? "bg-blue-500/10 text-blue-600"
                  : "hover:bg-muted"
              }`}
              onClick={() => {
                onModeChange("landscape");
              }}
            >
              <Globe className="h-4 w-4" />
              <div>
                <div className="font-medium">Market Landscape</div>
                <div className="text-xs text-muted-foreground">
                  Compare all {brands.length} brands at once
                </div>
              </div>
            </button>
          </div>

          {/* Head-to-Head */}
          {brands.length >= 2 && (
            <>
              <div className="border-t border-border my-1" />
              <div className="py-1">
                <div className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Swords className="h-3 w-3" />
                  Head-to-Head Compare
                </div>
                {brands.map((brand1, i) =>
                  brands.slice(i + 1).map((brand2) => (
                    <button
                      key={`h2h-${brand1}-${brand2}`}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                        currentMode === "headToHead" &&
                        selectedBrand1 === brand1 &&
                        selectedBrand2 === brand2
                          ? "bg-orange-500/10 text-orange-600"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => {
                        onModeChange("headToHead");
                        onBrand1Change?.(brand1);
                        onBrand2Change?.(brand2);
                      }}
                    >
                      {brand1} vs {brand2}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
