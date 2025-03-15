"use client";

import { useAnalytics } from "./provider";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Loader2, BarChart2, Clock, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Define sort types for place distribution
type SortField = 'placeId' | 'count' | 'percentage';
type SortDirection = 'asc' | 'desc';

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
  
  // Sorting state for place distribution table
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    // Initial data load
    loadDataWithTimeFilter(timeFilter);
    fetchStats(true);
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
      startDate,
      silent: true
    });
    
    setTimeFilter(timeRange);
  };

  // Prepare data for charts with proper formatting
  const prepareChartData = () => {
    if (!telemetryData.length) return [];

    const groupedByDate = telemetryData.reduce<Record<string, { count: number }>>((acc, item) => {
      const date = new Date(item.timestamp).toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.entries(groupedByDate)
      .map(([date, data]) => ({ 
        date, 
        ...data 
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();
  
  // Group by place ID
  const placeIdDistribution = telemetryData.reduce<Record<number, number>>((acc, item) => {
    acc[item.placeid] = (acc[item.placeid] || 0) + 1;
    return acc;
  }, {});
  
  // Convert to array for sorting
  const placeDistributionArray = Object.entries(placeIdDistribution).map(([placeId, count]) => ({
    placeId: Number(placeId),
    count,
    percentage: (count / telemetryData.length) * 100
  }));
  
  // Sort the place distribution array
  const sortedPlaceDistribution = [...placeDistributionArray].sort((a, b) => {
    if (sortField === 'placeId') {
      return sortDirection === 'asc' 
        ? a.placeId - b.placeId 
        : b.placeId - a.placeId;
    } else if (sortField === 'count') {
      return sortDirection === 'asc' 
        ? a.count - b.count 
        : b.count - a.count;
    } else { // percentage
      return sortDirection === 'asc' 
        ? a.percentage - b.percentage 
        : b.percentage - a.percentage;
    }
  });
  
  // Handle sort click
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  // Chart configuration for Shadcn charts
  const chartConfig = {
    count: {
      label: "Executions",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

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
              fetchStats(false);
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
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1 text-center sm:text-left">
                <CardTitle>Telemetry Activity Over Time</CardTitle>
                <CardDescription>
                  {timeFilter === "all" 
                    ? "All time activity" 
                    : `Activity in the last ${timeFilter === "24hours" ? "24 hours" : timeFilter === "7days" ? "7 days" : "30 days"}`}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              {chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-[350px] w-full"
                >
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-count)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-count)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="count"
                      type="monotone"
                      fill="url(#fillCount)"
                      stroke="var(--color-count)"
                      strokeWidth={2}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px]">
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
                Activity breakdown by Place ID - Click column headers to sort
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedPlaceDistribution.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => handleSortClick('placeId')}
                      >
                        <div className="flex items-center">
                          Place ID {renderSortIcon('placeId')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 text-right" 
                        onClick={() => handleSortClick('count')}
                      >
                        <div className="flex items-center justify-end">
                          Count {renderSortIcon('count')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 text-right" 
                        onClick={() => handleSortClick('percentage')}
                      >
                        <div className="flex items-center justify-end">
                          Percentage {renderSortIcon('percentage')}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPlaceDistribution.map(({ placeId, count, percentage }) => (
                      <TableRow key={placeId}>
                        <TableCell className="font-medium">
                          <a href={`https://www.roblox.com/games/${placeId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {placeId}
                          </a>
                        </TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                        <TableCell className="text-right">
                          {percentage.toFixed(1)}%
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
                        <TableHead>Executor</TableHead>
                        <TableHead>Place ID</TableHead>
                        <TableHead>Game ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {telemetryData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.exec}</TableCell>
                          <TableCell>
                            <a href={`https://www.roblox.com/games/${item.placeid}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {item.placeid}
                            </a>
                          </TableCell>
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