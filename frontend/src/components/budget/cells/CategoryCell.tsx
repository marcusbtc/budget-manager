import { useCategories } from "@/hooks/useBudget"

export function CategoryCell({ categoryId }: { categoryId: number }) {
  const { data: categories } = useCategories()
  const category = categories?.find((c) => c.id === categoryId)

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: category?.color }}
      />
      <span>{category?.name}</span>
    </div>
  )
}
