import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useBudgetEntries, useDeleteEntry } from "@/hooks/useBudget"
import type { BudgetEntry } from "@/types"
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { tableRow } from "@/animations/variants"
import { EntryFormDialog } from "@/components/entries/EntryFormDialog"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { CategoryCell, AmountCell, TypeBadge } from "./cells"
import { toast } from "sonner"

interface BudgetTableProps {
  startDate?: string
  endDate?: string
}

export function BudgetTable({ startDate, endDate }: BudgetTableProps) {
  const { data: entries, isLoading } = useBudgetEntries(startDate, endDate)
  const deleteMutation = useDeleteEntry()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [editingEntry, setEditingEntry] = useState<BudgetEntry | null>(null)
  const [deleteEntryId, setDeleteEntryId] = useState<number | null>(null)

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Entry deleted successfully")
      setDeleteEntryId(null)
    } catch {
      toast.error("Failed to delete entry")
    }
  }, [deleteMutation])

  const columns = useMemo<ColumnDef<BudgetEntry>[]>(() => [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span
          className="cursor-pointer hover:text-primary"
          onClick={() => setEditingEntry(row.original)}
          aria-label={`Edit ${row.original.description}`}
        >
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => <CategoryCell categoryId={row.original.category_id} />,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <AmountCell amount={row.original.amount} />,
    },
    {
      accessorKey: "entry_date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.entry_date).toLocaleDateString(),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <TypeBadge amount={row.original.amount} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingEntry(row.original)}
            aria-label={`Edit ${row.original.description}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteEntryId(row.original.id)}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${row.original.description}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ], [deleteMutation.isPending])

  const table = useReactTable({
    data: entries || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search entries..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex items-center gap-1 hover:text-primary"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    variants={tableRow}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No entries found.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {entries?.length || 0} entries
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <EntryFormDialog
        entry={editingEntry}
        open={editingEntry !== null}
        onOpenChange={() => setEditingEntry(null)}
      />

      <DeleteConfirmDialog
        open={deleteEntryId !== null}
        onOpenChange={() => setDeleteEntryId(null)}
        onConfirm={() => deleteEntryId && handleDelete(deleteEntryId)}
      />
    </div>
  )
}
