"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getFilteredRowModel,
  Row,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
import { LoaderIcon, MoreHorizontal } from "lucide-react";
import {
  calculateTimeStringRemainingFormated,
  cn,
  parseIntervalToMs,
} from "@/lib/utils";
import { toast } from "sonner";
import {
  DeleteSerial,
  GetAllSerialData,
  SyncUserExpiration,
} from "@/server/redeemkey";

interface DataTableProps<TData> {
  data: TData[];
}

export type SerialDef = {
  created_at: string;
  serial: string;
  claimed_at: string | null;
  key_duration: string | null;
  order_id: string;
  discord_id?: string;
  lrm_serial?: string;
  expires_at: number | null;
};

const claimedAtFilter: FilterFn<SerialDef> = (row, columnId, filterValue) => {
  const value = row.getValue<boolean>(columnId);
  const label = value ? "claimed" : "unclaimed";

  if (typeof filterValue !== 'string') return true;
  return label.includes(filterValue.toLowerCase());
};

export function SerialDataTable({ data }: DataTableProps<SerialDef>) {
  const [selectedSerial, setSelectedSerial] = React.useState<
    SerialDef | undefined
  >();
  const [serialEditOpen, setSerialEditOpen] = React.useState(false);
  const [serialDeleteOpen, setSerialDeleteOpen] = React.useState(false);
  const [serialData, setSerialData] = React.useState(data);
  const [serialRefreshKey, setSerialRefreshKey] = React.useState(0);
  const [time, setTime] = React.useState(Date.now());
  const [syncingRows, setSyncingRows] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const refreshData = (openEdit: boolean = false) => {
    setSerialEditOpen(openEdit);
    setSerialDeleteOpen(false);
    setSerialRefreshKey((key) => key + 1);
  };

  useEffect(() => {
    GetAllSerialData().then((data) => {
      setSerialData(data as SerialDef[]);
    });
  }, [serialRefreshKey]);

  const columns: ColumnDef<SerialDef>[] = [
    {
      accessorKey: "claimed_at",
      header: () => <p className="flex ml-4">Status</p>,
      cell: ({ row }) => {
        const claimedAt = row.getValue("claimed_at");
        return (
          <div className="ml-1">
            <Badge
              variant={claimedAt ? "outline" : "default"}
            >
              {claimedAt ? "Claimed" : "Unclaimed"}
            </Badge>
          </div>
        );
      },
      filterFn: claimedAtFilter
    },
    {
      accessorKey: "order_id",
      header: "Order ID",
    },
    {
      accessorKey: "serial",
      header: "mspaint serial",
    },
    {
      accessorKey: "key_duration",
      header: "Key Duration",
      cell: ({ row }) => {
        const keyDuration: string | null = row.original.key_duration;
        return (
          <div className="flex">
            {!keyDuration ? (
              <Badge variant={"outline"}>Lifetime</Badge>
            ) : (
              <span className="font-medium">{keyDuration}</span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "expires_at",
      header: "Expires At",
      cell: ({ row }) => {
        if (syncingRows.has(row.original.serial)) {
          return (
            <div className="flex items-center">
              <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
              Syncing...
            </div>
          );
        }

        const lrmExpiresAt: number | null = row.original.expires_at;
        const lrm_serial = row.original.lrm_serial;

        if (!lrmExpiresAt) {
          if ((lrm_serial?.length ?? 0) > 0) {
            return (
              <div className="flex">
                <Badge variant={"outline"}>Not Found/Syncronized</Badge>
              </div>
            );
          }
          //If there's no luarmor serial and expires_at is null
          return <span className={cn("text-muted-foreground")}>- -</span>;
        }

        if (!lrmExpiresAt) {
          return (
            <span className={cn("text-muted-foreground")}>{lrm_serial}</span>
          );
        }

        if (lrmExpiresAt == -1) {
          return (
            <div className="flex">
              <Badge variant={"outline"}>Lifetime</Badge>
            </div>
          );
        }

        const timeLeftMs = lrmExpiresAt - Date.now();
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
      accessorKey: "discord_id",
      header: "Discord ID",
      cell: ({ row }) => {
        const discord_id = row.getValue("discord_id");

        return (
          <span className={cn(discord_id ? "" : "text-muted-foreground")}>
            {discord_id ? String(discord_id) : "Not assigned yet"}
          </span>
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.serial ?? "");
                  toast.success("Serial copied to clipboard.");
                }}
              >
                Copy Serial
              </DropdownMenuItem>
              {selectedSerial?.lrm_serial && (
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(
                      row.original.lrm_serial ?? ""
                    );
                    toast.success("Luarmor Key copied to clipboard.");
                  }}
                >
                  Copy Luarmor Key
                </DropdownMenuItem>
              )}

              {selectedSerial?.discord_id && (
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(
                      row.original.discord_id ?? ""
                    );
                    toast.success("Discord ID copied to clipboard.");
                  }}
                >
                  Copy Discord ID
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.order_id ?? "");
                  toast.success("Order ID copied to clipboard.");
                }}
              >
                Copy Order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild disabled={!row.original.discord_id}>
                <div
                  className="w-full cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setSyncingRows((prev) =>
                      new Set(prev).add(row.original.serial)
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
                        newSet.delete(row.original.serial);
                        return newSet;
                      });
                    }
                  }}
                >
                  {syncingRows.has(row.original.serial) ? (
                    <span className="flex items-center">
                      <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                      Syncing...
                    </span>
                  ) : (
                    "Luarmor Sync"
                  )}
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedSerial(row.original);
                  setSerialEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setSelectedSerial(row.original);
                  setSerialDeleteOpen(true);
                }}
              >
                Delete
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

  const [filterTarget, setFilterTarget] = React.useState<string>("serial");

  const table = useReactTable<SerialDef>({
    data: serialData,
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
      <AlertDialog open={serialEditOpen} onOpenChange={setSerialEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edit Serial ({selectedSerial?.serial})
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Edit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={serialDeleteOpen} onOpenChange={setSerialDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              serial from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={() => {
                toast.promise(DeleteSerial(selectedSerial?.serial ?? ""), {
                  loading: "Deleting...",
                  success: (resp) => {
                    if (resp.status == 200) {
                      refreshData();
                      return "Serial deleted.";
                    } else {
                      refreshData();
                      throw new Error("Failed to delete serial.");
                    }
                  },
                  error: "Failed to delete serial.",
                });
              }}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center flex-row py-4">
        <Input
          placeholder={`Filter by ${filterTarget}...`}
          value={filterValue}
          onChange={(event) => {
            table.getColumn(filterTarget)?.setFilterValue(event.target.value);
            setFilterValue(event.target.value);
          }}
          className="max-w-sm text-[16px]"
        />
        <Select
          onValueChange={(value) => {
            table.getColumn(filterTarget)?.setFilterValue(undefined);
            setFilterValue("");
            setFilterTarget(value);
            if (value == "claimed_at") {
              table.getColumn(value)?.setFilterValue(true);
            }
          }}
          value={filterTarget}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claimed_at">Status</SelectItem>
            <SelectItem value="order_id">Order ID</SelectItem>
            <SelectItem value="serial">mspaint serial</SelectItem>
            <SelectItem value="lrm_serial">luarmor key</SelectItem>
            <SelectItem value="discord_id">Discord User ID</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  );
}
