import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EntryFormDialog } from "./EntryFormDialog"
import { useBudgetEntries, useDeleteEntry, useCategories } from "@/hooks/useBudget"
import { formatCurrency } from "@/lib/utils"
import type { BudgetEntry } from "@/types"
import { Pencil, Trash2, Plus } from "lucide-react"

export function EntryList() {
  const { data: entries, isLoading } = useBudgetEntries()
  const { data: categories } = useCategories()
  const deleteMutation = useDeleteEntry()
  const [editingEntry, setEditingEntry] = useState<BudgetEntry | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const getCategory = (categoryId: number) =>
    categories?.find((c) => c.id === categoryId)

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Entries</CardTitle>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </CardHeader>
        <CardContent>
          {entries?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No entries yet</p>
              <Button
                variant="link"
                onClick={() => setIsCreateOpen(true)}
                className="mt-2"
              >
                Create your first entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries?.map((entry) => {
                const category = getCategory(entry.category_id)
                const isExpense = entry.amount < 0

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category?.color + "20" }}
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category?.color }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{category?.name}</span>
                          <span>•</span>
                          <span>
                            {new Date(entry.entry_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={isExpense ? "destructive" : "default"}
                        className={
                          isExpense
                            ? ""
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        }
                      >
                        {isExpense ? "Expense" : "Income"}
                      </Badge>
                      <span
                        className={`font-semibold ${
                          isExpense ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {formatCurrency(entry.amount)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEntry(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <EntryFormDialog
        entry={editingEntry}
        open={!!editingEntry || isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEntry(null)
            setIsCreateOpen(false)
          }
        }}
      />
    </>
  )
}
