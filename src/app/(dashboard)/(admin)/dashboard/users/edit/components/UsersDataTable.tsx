"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, LoaderIcon, MoreHorizontal } from "lucide-react";
import { calculateTimeStringRemainingFormated, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  GetAllUserData,
  GetUserPurchaseHistory,
  SyncUserExpiration,
} from "@/server/redeemkey";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimelineElement } from "@/types";
import { TimelineLayout } from "@/components/ui/timeline-layout";

interface DataTableProps<TData> {
  data: TData[];
}

export type UserDef = {
  lrm_serial: string;
  discord_id: string;
  expires_at: number | null;
  is_banned: boolean;
};

export default function UsersDataTable({ data }: DataTableProps<UserDef>) {
  const [selectedUser, setSelectedUser] = React.useState<UserDef | null>(null);
  const [userData, setUserData] = React.useState(data);
  const [userRefreshKey, setUserRefreshKey] = React.useState(0);
  const [time, setTime] = React.useState(Date.now());
  const [syncingRows, setSyncingRows] = React.useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [purchaseHistory, setPurchaseHistory] = React.useState<TimelineElement[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'oldest' | 'newest'>('oldest');
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'oldest' ? 'newest' : 'oldest');
  };

  const fetchPurchaseHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      if (!selectedUser || !selectedUser.discord_id) {
        setHistoryError("No user selected or Discord ID is missing");
        return;
      }

      const history = (await GetUserPurchaseHistory(
        selectedUser.discord_id
      )) as {
        claimed_at: string;
        serial: string;
        key_duration: string;
        order_id: string;
      }[];

      // Reverse to show oldest first, newest last
      const reversedHistory = [...history].reverse();

      // Format history data into timeline elements
      const formattedHistory: TimelineElement[] = reversedHistory.map(
        (
          item: {
            claimed_at: string;
            serial: string;
            key_duration: string;
            order_id: string;
          },
          index: number
        ) => {
          const claimedDate = new Date(item.claimed_at);
          return {
            id: index,
            title: `Purchase ${index + 1}`,
            date: claimedDate.toISOString().split("T")[0],
            description: (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Serial:</span> {item.serial}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {item.key_duration || "Lifetime"}
                </div>
                <div>
                  <span className="font-medium">Order ID:</span> {item.order_id}
                </div>
              </div>
            ),
            status: "completed",
          };
        }
      );
      setPurchaseHistory(formattedHistory);
    } catch (error) {
      setHistoryError("Failed to load purchase history");
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    if (isDialogOpen && selectedUser) {
      fetchPurchaseHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, selectedUser]);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const refreshData = () => {
    setUserRefreshKey((key) => key + 1);
  };

  useEffect(() => {
    GetAllUserData().then((data) => {
      const sortedData = sortOrder === 'oldest' 
        ? data as UserDef[]
        : [...(data as UserDef[])].reverse();
      setUserData(sortedData);
    });
  }, [userRefreshKey, sortOrder]);

  const columns: ColumnDef<UserDef>[] = [
    {
      accessorKey: "discord_id",
      header: "Discord ID",
    },
    {
      accessorKey: "expires_at",
      header: "Expires At",
      cell: ({ row }) => {
        if (syncingRows.has(row.original.discord_id)) {
          return (
            <div className="flex items-center">
              <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
              Syncing...
            </div>
          );
        }

        const expires_at: number | null = row.original.expires_at;

        if (!expires_at) {
          return <span className={cn("text-muted-foreground")}>- -</span>;
        }

        if (expires_at == -1) {
          return (
            <div className="flex">
              <Badge variant={"outline"}>Lifetime</Badge>
            </div>
          );
        }

        const timeLeftMs = expires_at - Date.now();
        const [timeLeftText, timeLeftColor] =
          calculateTimeStringRemainingFormated(timeLeftMs);

        return (
          <div className="flex flex-col">
            <span className={cn("text-xs", timeLeftColor)}>{timeLeftText}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "lrm_serial",
      header: "LRM serial",
      cell: ({ row }) => {
        const lrm_serial = row.getValue("lrm_serial");

        return (
          <span className={cn(lrm_serial ? "" : "text-muted-foreground")}>
            {lrm_serial ? String(lrm_serial) : "Not assigned yet"}
          </span>
        );
      },
    },
    {
      accessorKey: "is_banned",
      header: () => <p className="ml-2">Banned</p>,
      cell: ({ row }) => {
        const is_banned = row.getValue("is_banned");
        return (
          <div className="flex flex-col-2 ml-3">
            <Badge variant={is_banned ? "destructive" : "outline"}>
              {is_banned ? "Yes" : "No"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.lrm_serial ?? "");
                  toast.success("Luarmor Key copied to clipboard.");
                }}
              >
                Copy Luarmor Key
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.discord_id ?? "");
                  toast.success("Discord ID copied to clipboard.");
                }}
              >
                Copy Discord ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild disabled={!row.original.discord_id}>
                <div
                  className="w-full cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setSyncingRows((prev) =>
                      new Set(prev).add(row.original.discord_id)
                    );

                    try {
                      if (!row.original.discord_id) {
                        toast.error("Discord ID is missing");
                        return;
                      }

                      const result = await SyncUserExpiration(
                        row.original.discord_id
                      );

                      if (result.status === 200) {
                        toast.success("Sync successful");
                        refreshData();
                      } else {
                        toast.error(result.error || "Sync failed");
                      }
                    } finally {
                      setSyncingRows((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(row.original.discord_id);
                        return newSet;
                      });
                    }
                  }}
                >
                  {syncingRows.has(row.original.discord_id) ? (
                    <span className="flex items-center">
                      <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                      Syncing...
                    </span>
                  ) : (
                    "Luarmor Sync"
                  )}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [filterValue, setFilterValue] = React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [filterTarget, setFilterTarget] = React.useState<string>("discord_id");

  const table = useReactTable<UserDef>({
    data: userData.reverse(),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center flex-row py-4">
        <Input
          placeholder={`Filter by ${filterTarget}...`}
          value={filterValue}
          onChange={(event) => {
            if (filterTarget == "is_banned") {
              const text = event.target.value;

              if (text.trim() == "") {
                table.getColumn(filterTarget)?.setFilterValue(undefined);
                setFilterValue(event.target.value);
                return;
              }

              if (
                text.toLowerCase().includes("false") ||
                text.toLowerCase().includes("active")
              ) {
                table.getColumn(filterTarget)?.setFilterValue(false);
              } else {
                table.getColumn(filterTarget)?.setFilterValue(true);
              }
            } else {
              table.getColumn(filterTarget)?.setFilterValue(event.target.value);
            }

            setFilterValue(event.target.value);
          }}
          className="max-w-sm text-[16px]"
        />
        <Select
          onValueChange={(value) => {
            table.getColumn(filterTarget)?.setFilterValue(undefined);
            setFilterValue("");
            setFilterTarget(value);
            if (value == "is_banned") {
              table.getColumn(value)?.setFilterValue(true);
            }
          }}
          value={filterTarget}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="is_banned">Ban Status</SelectItem>
            <SelectItem value="discord_id">Discord ID</SelectItem>
            <SelectItem value="lrm_serial">Luarmor Key</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={toggleSortOrder} 
          variant="outline" 
          className="ml-2"
        >
          {sortOrder !== 'oldest' ? 'Sort by newest' : 'Sort by oldest'}
        </Button>        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    setSelectedUser(row.original);
                    setIsDialogOpen(true);
                  }}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tracking {selectedUser?.discord_id}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[250px] overflow-y-auto">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-40">
                <LoaderIcon className="h-8 w-8 animate-spin" />
              </div>
            ) : historyError ? (
              <div className="text-red-500 p-4">{historyError}</div>
            ) : purchaseHistory.length > 0 ? (
              <TimelineLayout
                items={purchaseHistory}
                size="lg"
                iconColor="primary"
                customIcon={<CalendarIcon />}
              />
            ) : (
              <p className="text-muted-foreground p-4">
                No purchase history found
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
