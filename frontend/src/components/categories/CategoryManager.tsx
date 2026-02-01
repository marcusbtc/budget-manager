import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useCategories, useDeleteCategory } from "@/hooks/useBudget"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { DeleteConfirmDialog } from "../budget/DeleteConfirmDialog"
import type { Category } from "@/types"

export function CategoryManager() {
  const { data: categories, isLoading } = useCategories()
  const deleteMutation = useDeleteCategory()

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id)
    setDeleteCategoryId(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your budget categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
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
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your budget categories</CardDescription>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCategory(category)}
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteCategoryId(category.id)}
                    disabled={deleteMutation.isPending}
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoryFormDialog
        category={editingCategory}
        open={editingCategory !== null}
        onOpenChange={() => setEditingCategory(null)}
      />

      <CategoryFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <DeleteConfirmDialog
        open={deleteCategoryId !== null}
        onOpenChange={() => setDeleteCategoryId(null)}
        onConfirm={() => deleteCategoryId && handleDelete(deleteCategoryId)}
      />
    </>
  )
}
