import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateEntry, useUpdateEntry, useCategories } from "@/hooks/useBudget"
import type { BudgetEntry, BudgetEntryCreate } from "@/types"

const entrySchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  entry_date: z.string().optional(),
})

type EntryFormData = z.infer<typeof entrySchema>

interface EntryFormDialogProps {
  entry?: BudgetEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EntryFormDialog({ entry, open, onOpenChange }: EntryFormDialogProps) {
  const isEditing = !!entry
  const { data: categories } = useCategories()
  const createMutation = useCreateEntry()
  const updateMutation = useUpdateEntry()
  const [isExpense, setIsExpense] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      category_id: undefined,
      amount: undefined,
      description: "",
      entry_date: new Date().toISOString().split("T")[0],
    },
  })

  useEffect(() => {
    if (entry) {
      setIsExpense(entry.amount < 0)
      reset({
        category_id: entry.category_id,
        amount: Math.abs(entry.amount),
        description: entry.description,
        entry_date: entry.entry_date.split("T")[0],
      })
    } else {
      setIsExpense(false)
      reset({
        category_id: undefined,
        amount: undefined,
        description: "",
        entry_date: new Date().toISOString().split("T")[0],
      })
    }
  }, [entry, reset])

  const selectedCategory = watch("category_id")

  const onSubmit = async (data: EntryFormData) => {
    const amount = isExpense ? -data.amount : data.amount
    const payload: BudgetEntryCreate = {
      ...data,
      amount,
      entry_date: data.entry_date || new Date().toISOString(),
    }

    if (isEditing && entry) {
      await updateMutation.mutateAsync({ id: entry.id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }

    onOpenChange(false)
    reset()
    setIsExpense(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    reset()
    setIsExpense(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Entry" : "New Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={isExpense ? "default" : "outline"}
              className={isExpense ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={() => setIsExpense(true)}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={!isExpense ? "default" : "outline"}
              className={!isExpense ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              onClick={() => setIsExpense(false)}
            >
              Income
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory?.toString()}
              onValueChange={(value) => setValue("category_id", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("entry_date")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
