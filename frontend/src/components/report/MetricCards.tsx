import { MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardsProps {
  promptsCount: number;
  brandsCount: number;
}

export function MetricCards({ promptsCount, brandsCount }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{promptsCount}</p>
              <p className="text-xs text-muted-foreground">Prompts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{brandsCount}</p>
              <p className="text-xs text-muted-foreground">Brands</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
