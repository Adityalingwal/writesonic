import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardEntry } from "@/api";

export interface GapAnalysisData {
  brand1Wins: { prompt: string; reason: string }[];
  brand2Wins: { prompt: string; reason: string }[];
}

interface CompetitorAnalysisProps {
  isVisible: boolean;
  brand1Name: string;
  brand2Name: string;
  gapAnalysis: GapAnalysisData | null;
  brand1Metrics?: LeaderboardEntry | null;
  brand2Metrics?: LeaderboardEntry | null;
  onExit: () => void;
}

export function CompetitorAnalysis({
  isVisible,
  brand1Name,
  brand2Name,
  gapAnalysis,
  brand1Metrics,
  brand2Metrics,
  onExit,
}: CompetitorAnalysisProps) {
  if (!isVisible) return null;

  return (
    <>
      <div className="mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📊 Brand Comparison
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Close Comparison
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand 1 Card */}
          <Card className="bg-card border-l-4 border-l-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-primary">A</span>
                {brand1Name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brand1Metrics ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Visibility
                    </span>
                    <span className="font-bold text-lg">
                      {brand1Metrics.visibilityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${brand1Metrics.visibilityScore}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Citation Share
                    </span>
                    <span className="font-medium">
                      {brand1Metrics.citationShare}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Mentions
                    </span>
                    <span className="font-medium">
                      {brand1Metrics.mentionCount}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>

          {/* Brand 2 Card */}
          <Card className="bg-card border-l-4 border-l-blue-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="text-blue-500">B</span>
                {brand2Name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brand2Metrics ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Visibility
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {brand2Metrics.visibilityScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${brand2Metrics.visibilityScore}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Citation Share
                    </span>
                    <span className="font-medium">
                      {brand2Metrics.citationShare}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Mentions
                    </span>
                    <span className="font-medium">
                      {brand2Metrics.mentionCount}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gap Summary */}
        {brand1Metrics && brand2Metrics && (
          <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border text-center">
            <p className="text-sm font-medium">
              {brand1Metrics.visibilityScore > brand2Metrics.visibilityScore ? (
                <>
                  ✅ {brand1Name} leads by{" "}
                  {brand1Metrics.visibilityScore -
                    brand2Metrics.visibilityScore}
                  % visibility
                </>
              ) : brand2Metrics.visibilityScore >
                brand1Metrics.visibilityScore ? (
                <>
                  📈 {brand2Name} leads by{" "}
                  {brand2Metrics.visibilityScore -
                    brand1Metrics.visibilityScore}
                  % visibility
                </>
              ) : (
                <>📊 Both brands have equal visibility scores</>
              )}
            </p>
          </div>
        )}
      </div>

      {gapAnalysis && (
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              📈 Win/Loss Analysis
            </CardTitle>
            <CardDescription>
              Comparing prompt performance between {brand1Name} and {brand2Name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand 1 Wins */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                  <span>🏆</span> Where {brand1Name} wins
                </h4>
                {gapAnalysis.brand1Wins.length > 0 ? (
                  <div className="space-y-2">
                    {gapAnalysis.brand1Wins.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                      >
                        <p className="text-sm font-medium truncate">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No clear wins detected for {brand1Name}
                  </p>
                )}
              </div>

              {/* Brand 2 Wins */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-500 mb-3">
                  <span>🏆</span> Where {brand2Name} wins
                </h4>
                {gapAnalysis.brand2Wins.length > 0 ? (
                  <div className="space-y-2">
                    {gapAnalysis.brand2Wins.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20"
                      >
                        <p className="text-sm font-medium truncate">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No clear wins detected for {brand2Name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
