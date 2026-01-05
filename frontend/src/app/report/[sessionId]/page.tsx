"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Play,
  MessageSquare,
  ChevronDown,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PromptResponseCard } from "@/components/PromptResponseCard";
import { MetricCards } from "@/components/report/MetricCards";

import { TopCitedSources } from "@/components/report/TopCitedSources";
import { SingleBrandView } from "@/components/report/SingleBrandView";
import { MarketLandscape } from "@/components/report/MarketLandscape";

import { getSessionStatus, getResults, getCompetitiveMatrix } from "@/api";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionId = params.sessionId as string;

  // Fetch session status
  const {
    data: status,
    isLoading: statusLoading,
    isError: statusError,
  } = useQuery({
    queryKey: ["session-status", sessionId],
    queryFn: () => getSessionStatus(sessionId),
    retry: 2,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "RUNNING" ? 1500 : false;
    },
  });

  // Fetch results
  const { data: results } = useQuery({
    queryKey: ["session-results", sessionId],
    queryFn: () => getResults(sessionId),
    enabled: status?.status === "COMPLETED",
  });

  // Fetch competitive matrix
  const { data: matrixData } = useQuery({
    queryKey: ["session-matrix", sessionId],
    queryFn: () => getCompetitiveMatrix(sessionId),
    enabled: status?.status === "COMPLETED",
  });

  // Invalidate cache on completion
  useEffect(() => {
    if (status?.status === "COMPLETED") {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["recent-sessions"] });
    }
  }, [status?.status, queryClient]);

  // All brands from session
  const allBrands = results?.session?.brands || [];
  const myBrand = results?.session?.primaryBrand || allBrands[0];

  // View Type: "personal" (Single Brand) vs "market" (All Brands)
  const [viewType, setViewType] = useState<"personal" | "market">("personal");

  // Selected brand for impersonation mode (defaults to user's brand)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Determine the active brand to display
  const activeBrand = selectedBrand || myBrand;
  const isImpersonating = selectedBrand && selectedBrand !== myBrand;

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="hidden w-[220px] bg-sidebar text-sidebar-foreground flex-col md:flex">
        <div className="h-14 flex items-center px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-sidebar-foreground">Sonic</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 mt-4">
          <Link href="/" className="block">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
              <Play className="h-4 w-4" />
              Playground
            </button>
          </Link>
          <Link href="/reports" className="block">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              Reports
            </button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-auto">
        <div className="relative min-h-full">
          <div className="relative max-w-5xl mx-auto px-6 py-8">
            {/* Loading */}
            {statusLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error */}
            {statusError && !statusLoading && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-red-600">
                  Session not found
                </h3>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Start New Tracking
                  </Button>
                </Link>
              </div>
            )}

            {/* Content */}
            {!statusLoading && !statusError && (
              <>
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    {/* Status Badge */}
                    {status?.status && (
                      <Badge
                        className={
                          status.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600 border-0"
                            : status.status === "RUNNING"
                            ? "bg-primary/10 text-primary border-0"
                            : "bg-yellow-500/10 text-yellow-600 border-0"
                        }
                      >
                        {status.status}
                      </Badge>
                    )}
                  </div>

                  {/* View Type Toggle & Brand Selector */}
                  {status?.status === "COMPLETED" && (
                    <div className="flex items-center gap-3">
                      {/* Brand Selector Dropdown */}
                      {viewType === "personal" && allBrands.length > 1 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                              {activeBrand === myBrand ? (
                                <>
                                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                                  {activeBrand} (You)
                                </>
                              ) : (
                                <>
                                  <User className="h-3.5 w-3.5" />
                                  {activeBrand}
                                </>
                              )}
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {allBrands.map((brand) => (
                              <DropdownMenuItem
                                key={brand}
                                onClick={() =>
                                  setSelectedBrand(
                                    brand === myBrand ? null : brand
                                  )
                                }
                                className={`cursor-pointer ${
                                  brand === activeBrand ? "bg-accent" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  {brand === myBrand ? (
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                  ) : (
                                    <span className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                                  )}
                                  <span className="font-medium">
                                    {brand === myBrand
                                      ? `${brand} (You)`
                                      : brand}
                                  </span>
                                  {brand === activeBrand && (
                                    <span className="ml-auto text-primary">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {/* View Type Toggle */}
                      <div className="flex bg-muted p-1 rounded-lg h-10 items-center border border-border/50">
                        <button
                          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all h-full ${
                            viewType === "personal"
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setViewType("personal")}
                        >
                          Brand Report
                        </button>
                        <button
                          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all h-full ${
                            viewType === "market"
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setViewType("market")}
                        >
                          Market Landscape
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar (Running) */}
                {status?.status === "RUNNING" && status.totalPrompts && (
                  <Card className="mb-8 border-primary/30 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        Tracking in Progress
                      </CardTitle>
                      <CardDescription>
                        Processing prompts across AI platforms...
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {/* Report Data */}
                {status?.status === "COMPLETED" && (
                  <>
                    <MetricCards
                      promptsCount={results?.prompts?.length || 0}
                      brandsCount={results?.session?.brands?.length || 0}
                    />

                    {/* Single Brand Report (Personal View) */}
                    {viewType === "personal" && matrixData && (
                      <div className="mt-8">
                        {/* Impersonation Banner */}
                        {isImpersonating && (
                          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <User className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-amber-700 font-medium">
                              Viewing as: {activeBrand}
                            </span>
                            <button
                              onClick={() => setSelectedBrand(null)}
                              className="ml-auto text-xs text-amber-600 hover:text-amber-800 underline"
                            >
                              Back to My Report
                            </button>
                          </div>
                        )}

                        <div className="mb-6">
                          <h2 className="text-xl font-bold flex items-center gap-2">
                            {isImpersonating
                              ? `${activeBrand}'s Performance`
                              : "Your Performance Report"}
                          </h2>
                          <p className="text-muted-foreground">
                            Deep dive into visibility and mentions for{" "}
                            {activeBrand}
                          </p>
                        </div>
                        <SingleBrandView
                          brand={activeBrand}
                          data={matrixData}
                        />
                      </div>
                    )}

                    {/* Market Landscape Mode */}
                    {viewType === "market" && matrixData && (
                      <div className="mt-8">
                        <MarketLandscape
                          data={matrixData}
                          primaryBrand={myBrand}
                        />
                      </div>
                    )}

                    {/* Citations and Prompt Responses - Only in Market Landscape */}
                    {viewType === "market" && (
                      <>
                        {/* Show citations */}
                        <TopCitedSources citations={results?.citations || []} />

                        {/* Prompts List */}
                        <Card className="bg-card border-border mt-8">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <MessageSquare className="h-5 w-5 text-primary" />
                              Prompt Responses
                            </CardTitle>
                            <CardDescription>
                              AI responses with brand mentions
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {results?.prompts && results.prompts.length > 0 ? (
                              <div className="space-y-6">
                                {results.prompts.map((prompt, index) => {
                                  const promptResponses =
                                    results.responses?.filter(
                                      (r) => r.promptId === prompt.id
                                    ) || [];

                                  const promptMentions =
                                    results.mentions?.filter(
                                      (m) => m.promptId === prompt.id
                                    ) || [];

                                  return (
                                    <PromptResponseCard
                                      key={prompt.id}
                                      promptNumber={index + 1}
                                      promptText={prompt.promptText}
                                      responses={promptResponses}
                                      mentions={promptMentions}
                                      trackedBrands={allBrands}
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <p>No responses generated yet.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
