"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderIcon } from "lucide-react";

interface RateLimitStats {
  name: string;
  total: number;
  users: number;
  api_usage: number;
  api_maxusage: number;
  time_limit: string;
}

export default function RateLimitCardList() {
  const [stats, setStats] = useState<RateLimitStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/ratelimit-metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch rate limit metrics");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch rate limit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return !loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader>
            <CardTitle>{stat.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Actual Usage:</span>
                <span className="font-bold">{stat.api_usage}/{stat.api_maxusage}</span>
              </div>
              <h3 className="flex justify-center text-center text-lg">In the last {stat.time_limit.replace("remaining", "")}</h3>
              <div className="flex justify-between">
                <span className="text-xs">Total Requests:</span>
                <span className="font-normal">{stat.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Unique Users:</span>
                <span className="font-normal">{stat.users}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center">
      <span className="text-center p-4">
      Loading rate limit stats...
      </span>
      <LoaderIcon className="h-8 w-8 animate-spin" />
    </div>
  );
}
