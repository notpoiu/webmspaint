"use client";

import { useAnalytics } from "./provider";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, BarChart2, Clock, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AnalyticsClient() {
  const { 
    telemetryData, 
    totalCount, 
    hasMore, 
    isLoading, 
    stats, 
    fetchTelemetryData, 
    fetchStats 
  } = useAnalytics();

  const [timeFilter, setTimeFilter] = useState<string>("all");

  useEffect(() => {
    // Initial data load
    loadDataWithTimeFilter(timeFilter);
    fetchStats();
  }, [fetchStats]);

  const loadDataWithTimeFilter = (timeRange: string) => {
    const now = Date.now();
    let startDate: number | undefined = undefined;

    switch (timeRange) {
      case "7days":
        startDate = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30days":
        startDate = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "24hours":
        startDate = now - 24 * 60 * 60 * 1000;
        break;
      default:
        // "all" case - no filter
        startDate = undefined;
    }

    fetchTelemetryData({ 
      limit: 100,
      startDate
    });
    
    setTimeFilter(timeRange);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!telemetryData.length) return [];

    const groupedByDate = telemetryData.reduce<Record<string, number>>((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();
  
  // Group by place ID
  const placeIdDistribution = telemetryData.reduce<Record<number, number>>((acc, item) => {
    acc[item.placeid] = (acc[item.placeid] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
        <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                        Dashboard
                    </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Analytics</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">mspaint analytics</h2>
        
        <div className="flex items-center gap-2">
          <Select value={timeFilter} onValueChange={loadDataWithTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {
              loadDataWithTimeFilter(timeFilter);
              fetchStats();
            }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Filter className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Telemetry Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Places</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniquePlaceIds}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueGameIds}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {stats.mostRecentTimestamp 
                    ? new Date(stats.mostRecentTimestamp).toLocaleString() 
                    : "No activity"}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Skeleton loaders for stats
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[140px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts and Tables in Tabs */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart" className="data-[state=active]:bg-[rgb(25,25,25)]">Activity Chart</TabsTrigger>
          <TabsTrigger value="places" className="data-[state=active]:bg-[rgb(25,25,25)]">Place Distribution</TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-[rgb(25,25,25)]">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Telemetry Activity Over Time</CardTitle>
              <CardDescription>
                {timeFilter === "all" 
                  ? "All time activity" 
                  : `Activity in the last ${timeFilter === "24hours" ? "24 hours" : timeFilter === "7days" ? "7 days" : "30 days"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="# of Records"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <BarChart2 className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No data available for the selected time period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="places">
          <Card>
            <CardHeader>
              <CardTitle>Place ID Distribution</CardTitle>
              <CardDescription>
                Activity breakdown by Place ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(placeIdDistribution).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Place ID</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(placeIdDistribution).map(([placeId, count]) => (
                      <TableRow key={placeId}>
                        <TableCell className="font-medium">{placeId}</TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                        <TableCell className="text-right">
                          {((count / telemetryData.length) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px]">
                  <p className="text-gray-500">No data available for the selected time period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Telemetry Raw Data</CardTitle>
              <CardDescription>
                Showing {telemetryData.length} of {totalCount} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {telemetryData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Execution</TableHead>
                        <TableHead>Place ID</TableHead>
                        <TableHead>Game ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telemetryData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.exec}</TableCell>
                          <TableCell>{item.placeid}</TableCell>
                          <TableCell>{item.gameid}</TableCell>
                          <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px]">
                  <Clock className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No data available for the selected time period</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {hasMore && (
                <Button
                  onClick={() => fetchTelemetryData({
                    limit: 20,
                    offset: telemetryData.length,
                    startDate: timeFilter !== "all" ? getStartDateFromFilter(timeFilter) : undefined
                  })}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
                  ) : (
                    "Load More"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get start date from filter
function getStartDateFromFilter(filter: string): number | undefined {
  const now = Date.now();
  switch (filter) {
    case "24hours":
      return now - 24 * 60 * 60 * 1000;
    case "7days":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "30days":
      return now - 30 * 24 * 60 * 60 * 1000;
    default:
      return undefined;
  }
}