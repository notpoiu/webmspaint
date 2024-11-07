"use client"

import { ColumnDef, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import React, { useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { DeleteSerial, GetAllSerialData } from "@/server/redeemkey"


interface DataTableProps<TData> {
    data: TData[]
}

export type SerialDef = {
    serial: string
    order_id: string
    claimed: boolean
    claimed_discord_id?: string
    lrm_serial?: string
}

export function SerialDataTable({
  data,
}: DataTableProps<SerialDef>) {
  const [selectedSerial, setSelectedSerial] = React.useState<SerialDef | undefined>();
  const [serialEditOpen, setSerialEditOpen] = React.useState(false);
  const [serialDeleteOpen, setSerialDeleteOpen] = React.useState(false);
  const [serialData, setSerialData] = React.useState(data);
  const [serialRefreshKey, setSerialRefreshKey] = React.useState(0);

  const refreshData = () => {
    setSerialEditOpen(false);
    setSerialDeleteOpen(false);
    setSerialRefreshKey((key) => key + 1);
  }

  useEffect(() => {
    GetAllSerialData().then((data) => {
      setSerialData(data as SerialDef[]);
    });
  }, [serialRefreshKey])
  
  const columns: ColumnDef<SerialDef>[] = [
      {
          accessorKey: "order_id",
          header: "Order ID",
      },
      {
        accessorKey: "serial",
        header: "mspaint serial",
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
          )
        }
      },
      {
        accessorKey: "claimed_discord_id",
        header: "Discord ID",
        cell: ({ row }) => {
          const discord_id = row.getValue("claimed_discord_id");

          return (
            <span className={cn(discord_id ? "" : "text-muted-foreground")}>
              {discord_id ? String(discord_id) : "Not assigned yet"}
            </span>
          )
        }
      },
      {
          accessorKey: "claimed",
          header: () => <p className="text-center">Status</p>,
          cell: ({ row }) => {
            const amount = row.getValue("claimed");
            return (
              <div className="flex justify-center items-center">
                <Badge variant={amount ? "outline" : "default"} className="justify-center">{amount ? "Claimed" : "Unclaimed"}</Badge>
              </div>
            )
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
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(row.original.serial ?? "");
                  toast.success("Serial copied to clipboard.");
                }}>Copy Serial</DropdownMenuItem>
                {selectedSerial?.lrm_serial && (
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(row.original.lrm_serial ?? "");
                    toast.success("Luarmor Key copied to clipboard.");
                  }}>Copy Luarmor Key</DropdownMenuItem>
                )}

                {selectedSerial?.claimed_discord_id && (
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(row.original.claimed_discord_id ?? "");
                    toast.success("Discord ID copied to clipboard.");
                  }}>Copy Discord ID</DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(row.original.order_id ?? "");
                  toast.success("Order ID copied to clipboard.");
                }}>Copy Order ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setSelectedSerial(row.original);
                  setSerialEditOpen(true);
                }}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => {
                  setSelectedSerial(row.original);
                  setSerialDeleteOpen(true);
                }}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }
  ]

  const [filterValue, setFilterValue] = React.useState<string>("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

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
  })

  return (
    <div>
      <AlertDialog open={serialEditOpen} onOpenChange={setSerialEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coming soon.</AlertDialogTitle>
            <AlertDialogDescription>
              This is enough coding react for today :content:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dont care</AlertDialogCancel>
            <AlertDialogAction>Ok lazy ass</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={serialDeleteOpen} onOpenChange={setSerialDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this serial from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant={"destructive"} onClick={() => {
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
                error: "Failed to delete serial."
              })
            }}>Continue</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center flex-row py-4">
        <Input
          placeholder={`Filter by ${filterTarget}...`}
          value={filterValue}
          onChange={(event) => {
            if (filterTarget == "claimed") {
              const text = event.target.value;

              if (text.trim() == "") {
                table.getColumn(filterTarget)?.setFilterValue(undefined);
                setFilterValue(event.target.value);
                return;
              }

              if (text.toLowerCase().includes("u") || text.toLowerCase().includes("n") || text.toLowerCase().includes("false")) {
                table.getColumn(filterTarget)?.setFilterValue(false);
              } else {
                table.getColumn(filterTarget)?.setFilterValue(true);
              }
            } else {
              table.getColumn(filterTarget)?.setFilterValue(event.target.value);
            }

            setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => {
          table.getColumn(filterTarget)?.setFilterValue(undefined);
          setFilterValue("");
          setFilterTarget(value);
          if (value == "claimed") {
            table.getColumn(value)?.setFilterValue(true);
          }
        }} value={filterTarget}>
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order_id">Order ID</SelectItem>
            <SelectItem value="serial">mspaint serial</SelectItem>
            <SelectItem value="lrm_serial">luarmor key</SelectItem>
            <SelectItem value="claimed_discord_id">Discord User ID</SelectItem>
            <SelectItem value="claimed">Status</SelectItem>
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
                  )
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}
