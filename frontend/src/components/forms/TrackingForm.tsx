"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, X, Sparkles, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { startTracking } from "@/api";

const trackingSchema = z.object({
  category: z.string().min(1, "Category is required"),
  myBrand: z.string().min(1, "Your brand is required"),
  competitors: z.array(z.string()).min(1, "Add at least one competitor"),
});

type TrackingFormValues = z.infer<typeof trackingSchema>;

export function TrackingForm() {
  const router = useRouter();
  const [competitorInput, setCompetitorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      category: "",
      myBrand: "",
      competitors: [],
    },
  });

  const competitors = form.watch("competitors");

  const addCompetitor = () => {
    const trimmed = competitorInput.trim();
    if (trimmed && !competitors.includes(trimmed)) {
      form.setValue("competitors", [...competitors, trimmed]);
      setCompetitorInput("");
    }
  };

  const removeCompetitor = (competitor: string) => {
    form.setValue(
      "competitors",
      competitors.filter((c) => c !== competitor)
    );
  };

  const handleCompetitorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  };

  const onSubmit = async (data: TrackingFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await startTracking({
        category: data.category,
        myBrand: data.myBrand,
        competitors: data.competitors,
      });

      router.push(`/report/${response.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start tracking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    if (competitorInput.trim()) {
      const trimmed = competitorInput.trim();
      if (!competitors.includes(trimmed)) {
        form.setValue("competitors", [...competitors, trimmed]);
      }
      setCompetitorInput("");
    }
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Start Tracking</h2>
            <p className="text-xs text-muted-foreground">
              Compare your brand against competitors
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Category Input */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-medium">Category</Label>
                  <FormControl>
                    <Input
                      placeholder="e.g., CRM software, project management tools"
                      className="h-10 bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Your Brand Input */}
            <FormField
              control={form.control}
              name="myBrand"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Your Brand
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="e.g., Salesforce, Cursor, Nike"
                      className="h-10 bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Competitors Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-orange-500" />
                Competitor Brands
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter competitor name and press Enter or +"
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyDown={handleCompetitorKeyDown}
                  className="h-10 bg-background flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCompetitor}
                  className="h-10 w-10 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Competitor tags */}
              {competitors.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {competitors.map((competitor) => (
                    <Badge
                      key={competitor}
                      variant="secondary"
                      className="pl-3 pr-1.5 py-1.5 text-sm bg-orange-500/10 text-orange-600 border-0 hover:bg-orange-500/20"
                    >
                      {competitor}
                      <button
                        type="button"
                        onClick={() => removeCompetitor(competitor)}
                        className="ml-1.5 hover:bg-orange-500/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {form.formState.errors.competitors && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.competitors.message}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Audit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
