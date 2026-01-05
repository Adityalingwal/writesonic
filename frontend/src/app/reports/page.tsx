"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Play,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe,
  TrendingUp,
  ArrowUpRight,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resultsApi } from "@/api";

interface ReportSession {
  id: string;
  category: string;
  brands: string[];
  status: string;
  createdAt: string;
  completedAt?: string;
  totalPrompts: number;
}

export default function ReportsPage() {
  const queryClient = useQueryClient();

  // ✅ React Query with smart polling + error handling
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await resultsApi.getRecent();
      return res.sessions as ReportSession[];
    },
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Wait 1 second between retries
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
    refetchInterval: (query) => {
      const sessions = query.state.data || [];
      const hasRunning = sessions.some(
        (s: ReportSession) => s.status === "RUNNING"
      );
      return hasRunning ? 5000 : false;
    },
  });

  const sessions = data || [];

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ReportSession | null>(
    null
  );

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => resultsApi.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["recent-sessions"] });
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, session: ReportSession) => {
    e.preventDefault();
    e.stopPropagation();
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-0 font-medium">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "RUNNING":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-0 font-medium">
            <Clock className="h-3 w-3 mr-1 animate-pulse" />
            Running
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-0 font-medium">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-0 font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

        <div className="px-3 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-9 pl-9 pr-3 text-sm bg-sidebar-accent border-0 rounded-lg text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <kbd className="absolute right-2.5 top-2.5 pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-zinc-700 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          <Link href="/" className="block">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
              <Play className="h-4 w-4" />
              Playground
            </button>
          </Link>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg bg-sidebar-accent text-primary">
            <FileText className="h-4 w-4" />
            Reports
          </button>
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/50 text-center">
            AI Visibility Tracker
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <main className="flex-1 overflow-auto">
          <div className="relative min-h-full">
            <div className="relative max-w-4xl mx-auto px-6 py-16">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Reports
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    View your AI visibility tracking results
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                    />
                  </Button>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      New Tracking
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Reports List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : isError ? (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-red-600">
                    Failed to load reports
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    Something went wrong. Please check your connection and try
                    again.
                  </p>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : sessions.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    Start your first AI visibility tracking to generate a
                    report.
                  </p>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Start Tracking
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/report/${session.id}`}
                      className="block group"
                    >
                      <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {session.category}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                <span>{session.brands.length} brands</span>
                                <span>•</span>
                                <span>{formatDate(session.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(session.status)}
                            <button
                              onClick={(e) => handleDeleteClick(e, session)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete session"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tracking session for{" "}
              <strong>{sessionToDelete?.category}</strong> and all its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                sessionToDelete && deleteMutation.mutate(sessionToDelete.id)
              }
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
