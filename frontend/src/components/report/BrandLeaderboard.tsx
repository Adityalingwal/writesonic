import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardEntry } from "@/api";

interface BrandLeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export function BrandLeaderboard({ leaderboard }: BrandLeaderboardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Brand Leaderboard
        </CardTitle>
        <CardDescription>
          Rankings based on visibility score across all prompts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard && leaderboard.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Visibility</TableHead>
                <TableHead className="text-right">Citation Share</TableHead>
                <TableHead className="text-right">Mentions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow key={entry.brand} className="border-border">
                  <TableCell className="font-bold text-primary">
                    #{entry.rank}
                  </TableCell>
                  <TableCell className="font-medium">{entry.brand}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-primary font-semibold">
                      {entry.visibilityScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.citationShare}%
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.mentionCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No brand mentions detected yet</p>
            <p className="text-sm mt-1">Try tracking with different brands</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
