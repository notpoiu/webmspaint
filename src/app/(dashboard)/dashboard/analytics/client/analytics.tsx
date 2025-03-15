"use client";


interface RobloxGameResponse {
    data: {
      id: number;
      rootPlaceId: number;
      name: string;
      description: string;
      sourceName?: string;
      sourceDescription?: string;
      creator: {
        id: number;
        name: string;
        type: string;
      };
      price?: number;
      allowedGearGenres: string[];
      allowedGearCategories: string[];
      isGenreEnforced: boolean;
      copying: boolean;
      playing: number;
      visits: number;
      maxPlayers: number;
      created: string;
      updated: string;
      studioAccessToApisAllowed: boolean;
      createVipServersAllowed: boolean;
      universeAvatarType: string;
      genre: string;
      isAllGenre: boolean;
      isFavoritedByUser: boolean;
      favoritedCount: number;
    }[];
}
  

import { useAnalytics } from "./provider";
import { useEffect, useState, createContext, useContext, useMemo, useCallback } from "react";
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
import { ChevronDown, ChevronUp, Loader2, BarChart2, Clock, Filter, StarIcon, ScrollIcon, LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CopyDropdown from "@/components/copy-dropdown";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type SortField = 'placeId' | 'count' | 'percentage' | 'gameId';
type SortDirection = 'asc' | 'desc';
type GameData = RobloxGameResponse["data"][0] | null;

// Create a context for the game data cache
interface GameCacheContextType {
  gameData: Record<number, GameData>;
  fetchGameData: (gameId: number) => Promise<void>;
  isLoading: Record<number, boolean>;
}

const GameCacheContext = createContext<GameCacheContextType>({
  gameData: {},
  fetchGameData: async () => {},
  isLoading: {}
});

// Game Cache Provider component
function GameCacheProvider({ children }: { children: React.ReactNode }) {
  const [gameData, setGameData] = useState<Record<number, GameData>>({});
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});

  // Load cached data from localStorage on initial render
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem('mspaint-game-cache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Only use cache if it's less than 7 days old
        if (parsedData.timestamp && (Date.now() - parsedData.timestamp < 7 * 24 * 60 * 60 * 1000)) {
          setGameData(parsedData.data || {});
        }
      }
    } catch (error) {
      console.error("Error loading game cache from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever gameData changes
  useEffect(() => {
    if (Object.keys(gameData).length > 0) {
      try {
        localStorage.setItem('mspaint-game-cache', JSON.stringify({
          data: gameData,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error("Error saving game cache to localStorage:", error);
      }
    }
  }, [gameData]);

  // Function to fetch game data and update cache
  const fetchGameData = useCallback(async (gameId: number) => {
    // Skip if already loading or data exists
    if (isLoading[gameId] || gameData[gameId]) return;

    // Mark as loading
    setIsLoading(prev => ({ ...prev, [gameId]: true }));

    try {
      const response = await fetch(`/api/lookup/roblox/${gameId}`);
      const data = await response.json();
      
      // Update cache with new data
      setGameData(prev => ({ ...prev, [gameId]: data }));
    } catch (error) {
      console.error(`Error fetching game info for ${gameId}:`, error);
      // Store null for failed requests to prevent repeated failures
      setGameData(prev => ({ ...prev, [gameId]: null }));
    } finally {
      // Mark as no longer loading
      setIsLoading(prev => ({ ...prev, [gameId]: false }));
    }
  }, [gameData, isLoading]);

  const value = useMemo(() => ({
    gameData,
    fetchGameData,
    isLoading
  }), [gameData, fetchGameData, isLoading]);

  return (
    <GameCacheContext.Provider value={value}>
      {children}
    </GameCacheContext.Provider>
  );
}

// Hook to access the game cache
function useGameCache() {
  return useContext(GameCacheContext);
}

// Updated GameInfoComponent to use cache
function GameInfoComponent({ gameid, placeid }: { gameid: number, placeid?: number }) {
  const { gameData, fetchGameData, isLoading } = useGameCache();
  const data = gameData[gameid];
  
  useEffect(() => {
    if (!data && !isLoading[gameid]) {
      fetchGameData(gameid);
    }
  }, [gameid, data, fetchGameData, isLoading]);

  // Show skeleton while loading
  if (!data && isLoading[gameid]) {
    return (
      <Card className="px-2 py-2 flex flex-row justify-center items-center gap-2 max-w-[500px]">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <div className="flex flex-row items-center space-x-2">
            <div className="flex flex-row text-xs items-center">
              <ScrollIcon className="h-4 w-4" />
              <Skeleton className="h-3 w-20 ml-1" />
            </div>
            <div className="flex flex-row text-xs items-center">
              <StarIcon className="h-4 w-4" />
              <Skeleton className="h-3 w-8 ml-1" />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-24" />
        </div>
      </Card>
    );
  }

  // Handle error/not found
  if (!data) {
    return (
      <Card className="px-2 py-2 flex flex-row justify-center items-center gap-2 max-w-[500px]">
        <div>
          <p>Unknown Game</p>
          <p className="text-xs text-muted-foreground">Game ID: {gameid}</p>
        </div>
        <div className="flex flex-row gap-2 ml-auto">
          <CopyDropdown size="sm" items={[
            { name: "Copy Game ID", value: gameid.toString() },
            { name: "Copy Place ID", value: (placeid ?? "No Place ID").toString() },
          ]} />
        </div>
      </Card>
    );
  }

  // Normal rendering with data
  return (
    <Card className="px-2 py-2 flex flex-row justify-center items-center gap-2 max-w-[500px]">
      <div>
        <p>{data.name}</p>
        <div className="flex flex-row items-center space-x-2">
          <div className="flex flex-row text-xs items-center text-muted-foreground">
            <ScrollIcon className="h-4 w-4" />
            <span className="max-w-[8rem] text-nowrap overflow-hidden text-ellipsis">{data.description}</span>
          </div>
          <div className="flex flex-row text-xs items-center text-muted-foreground">
            <StarIcon className="h-4 w-4" />{data.favoritedCount?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 ml-auto">
        <CopyDropdown size="sm" items={[
          { name: "Copy Game ID", value: gameid.toString() },
          { name: "Copy Place ID", value: (placeid ?? "No Place ID").toString() },
        ]} />
        <a href={`https://www.roblox.com/games/${data.rootPlaceId}`} target="_blank" rel="noopener noreferrer"> 
          <Button variant="outline" size={"sm"}>
            <LinkIcon className="mr-2 h-4 w-4" />
            View on Roblox
          </Button>
        </a>
      </div>
    </Card>
  );
}

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

  // Pagination state for place distribution
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  
  // Add pagination state for raw data table
  const [rawDataCurrentPage, setRawDataCurrentPage] = useState(1);
  const [rawDataItemsPerPage, setRawDataItemsPerPage] = useState(10);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedLoadDataWithTimeFilter = useCallback(loadDataWithTimeFilter, [fetchTelemetryData]);

  useEffect(() => {
    // Initial data load
    memoizedLoadDataWithTimeFilter(timeFilter);
    fetchStats(true);
  }, [fetchStats, timeFilter, memoizedLoadDataWithTimeFilter]);

  function loadDataWithTimeFilter(timeRange: string) {
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
  }

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
  
  // Group by game ID instead of place ID for the place distribution
  const placeIdDistribution = telemetryData.reduce<Record<number, { placeid: number, count: number }>>((acc, item) => {
    if (!acc[item.gameid]) {
      acc[item.gameid] = {
        placeid: item.placeid,
        count: 0
      };
    }
    acc[item.gameid].count += 1;
    return acc;
  }, {});
  
  // Convert to array for sorting
  const placeDistributionArray = Object.entries(placeIdDistribution).map(([gameId, data]) => ({
    placeId: Number(data.placeid),
    gameid: Number(gameId),
    count: data.count,
    percentage: (data.count / telemetryData.length) * 100
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
    } else if (sortField === 'gameId') {
      return sortDirection === 'asc'
        ? a.gameid - b.gameid
        : b.gameid - a.gameid;
    } else { // percentage
      return sortDirection === 'asc' 
        ? a.percentage - b.percentage 
        : b.percentage - a.percentage;
    }
  });
  
  // Calculate pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPlaceDistribution.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPlaceDistribution.length / itemsPerPage);
  
  // Function to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  const maxPageButtons = 5; // Show max 5 page buttons
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
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

  // Calculate pagination for raw data table
  const rawDataTotalPages = Math.ceil(telemetryData.length / rawDataItemsPerPage);
  const rawDataStartIndex = (rawDataCurrentPage - 1) * rawDataItemsPerPage;
  const rawDataEndIndex = Math.min(rawDataStartIndex + rawDataItemsPerPage, telemetryData.length);
  const paginatedRawData = telemetryData.slice(rawDataStartIndex, rawDataEndIndex);
  
  // Generate page numbers for raw data pagination
  const rawDataPageNumbers = [];
  const maxRawDataPageButtons = 5; // Show max 5 page buttons
  
  let rawDataStartPage = Math.max(1, rawDataCurrentPage - Math.floor(maxRawDataPageButtons / 2));
  const rawDataEndPage = Math.min(rawDataTotalPages, rawDataStartPage + maxRawDataPageButtons - 1);
  
  // Adjust if we're near the end
  if (rawDataEndPage - rawDataStartPage + 1 < maxRawDataPageButtons && rawDataStartPage > 1) {
    rawDataStartPage = Math.max(1, rawDataEndPage - maxRawDataPageButtons + 1);
  }
  
  for (let i = rawDataStartPage; i <= rawDataEndPage; i++) {
    rawDataPageNumbers.push(i);
  }
  
  // Function to paginate raw data
  const paginateRawData = (pageNumber: number) => setRawDataCurrentPage(pageNumber);

  return (
    <GameCacheProvider>
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
            <Select value={timeFilter} onValueChange={memoizedLoadDataWithTimeFilter}>
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
                memoizedLoadDataWithTimeFilter(timeFilter);
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
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50" 
                            onClick={() => handleSortClick('gameId')}
                          >
                            <div className="flex items-center">
                              Game {renderSortIcon('gameId')}
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
                        {currentItems.map(({ placeId, gameid, count, percentage }) => (
                          <TableRow key={placeId}>
                            <TableCell>
                              <GameInfoComponent gameid={gameid} placeid={placeId} />
                            </TableCell>
                            <TableCell className="text-right">{count}</TableCell>
                            <TableCell className="text-right">
                              {percentage.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                              />
                            </PaginationItem>
                            
                            {startPage > 1 && (
                              <>
                                <PaginationItem>
                                  <PaginationLink onClick={() => paginate(1)}>1</PaginationLink>
                                </PaginationItem>
                                {startPage > 2 && (
                                  <PaginationItem>
                                    <PaginationLink className="cursor-default">...</PaginationLink>
                                  </PaginationItem>
                                )}
                              </>
                            )}
                            
                            {pageNumbers.map(number => (
                              <PaginationItem key={number}>
                                <PaginationLink 
                                  onClick={() => paginate(number)}
                                  isActive={currentPage === number}
                                >
                                  {number}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            {endPage < totalPages && (
                              <>
                                {endPage < totalPages - 1 && (
                                  <PaginationItem>
                                    <PaginationLink className="cursor-default">...</PaginationLink>
                                  </PaginationItem>
                                )}
                                <PaginationItem>
                                  <PaginationLink onClick={() => paginate(totalPages)}>{totalPages}</PaginationLink>
                                </PaginationItem>
                              </>
                            )}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                        
                        <div className="flex items-center mr-4 absolute left-0">
                          <span className="mr-2 text-sm text-muted-foreground">Items per page:</span>
                          <input 
                            type="number" 
                            min="5"
                            max="100"
                            value={currentPage}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value >= 5 && value <= 100) {
                                setItemsPerPage(value);
                                setCurrentPage(1); // Reset to first page
                              }
                            }}
                            className="w-16 h-8 rounded-md border border-input px-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </>
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
                  Showing {paginatedRawData.length} of {totalCount} records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {telemetryData.length > 0 ? (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Executor</TableHead>
                            <TableHead>Game</TableHead>
                            <TableHead>Timestamp</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedRawData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.exec}</TableCell>
                              <TableCell>
                                <GameInfoComponent gameid={item.gameid} placeid={item.placeid} />
                              </TableCell>
                              <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Raw Data Pagination controls */}
                    {telemetryData.length > 0 && (
                      <div className="mt-4 flex items-center relative">
                        <div className="flex items-center mr-4 absolute left-0">
                          <span className="mr-2 text-sm text-muted-foreground">Items per page:</span>
                          <input 
                            type="number" 
                            min="5"
                            max="100"
                            value={rawDataItemsPerPage}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value >= 5 && value <= 100) {
                                setRawDataItemsPerPage(value);
                                setRawDataCurrentPage(1); // Reset to first page
                              }
                            }}
                            className="w-16 h-8 rounded-md border border-input px-2 text-sm"
                          />
                        </div>
                        
                        <Pagination className="ml-auto">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => paginateRawData(Math.max(1, rawDataCurrentPage - 1))}
                                className={rawDataCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                              />
                            </PaginationItem>
                            
                            {rawDataStartPage > 1 && (
                              <>
                                <PaginationItem>
                                  <PaginationLink onClick={() => paginateRawData(1)}>1</PaginationLink>
                                </PaginationItem>
                                {rawDataStartPage > 2 && (
                                  <PaginationItem>
                                    <PaginationLink className="cursor-default">...</PaginationLink>
                                  </PaginationItem>
                                )}
                              </>
                            )}
                            
                            {rawDataPageNumbers.map(number => (
                              <PaginationItem key={number}>
                                <PaginationLink 
                                  onClick={() => paginateRawData(number)}
                                  isActive={rawDataCurrentPage === number}
                                >
                                  {number}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            {rawDataEndPage < rawDataTotalPages && (
                              <>
                                {rawDataEndPage < rawDataTotalPages - 1 && (
                                  <PaginationItem>
                                    <PaginationLink className="cursor-default">...</PaginationLink>
                                  </PaginationItem>
                                )}
                                <PaginationItem>
                                  <PaginationLink onClick={() => paginateRawData(rawDataTotalPages)}>{rawDataTotalPages}</PaginationLink>
                                </PaginationItem>
                              </>
                            )}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => paginateRawData(Math.min(rawDataTotalPages, rawDataCurrentPage + 1))}
                                className={rawDataCurrentPage === rawDataTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                    
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      Showing {rawDataStartIndex + 1}-{rawDataEndIndex} of {telemetryData.length} items
                    </div>
                  </>
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
    </GameCacheProvider>
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