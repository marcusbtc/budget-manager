import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/useBudget"
import type { BudgetEntry } from "@/types"
import { Check, X } from "lucide-react"

interface InlineEditFormProps {
  entry: BudgetEntry
  onSave: (data: Partial<BudgetEntry>) => void
  onCancel: () => void
}

export function InlineEditForm({ entry, onSave, onCancel }: InlineEditFormProps) {
  const { data: categories } = useCategories()
  const [isExpense, setIsExpense] = useState(entry.amount < 0)
  const [description, setDescription] = useState(entry.description)
  const [amount, setAmount] = useState(Math.abs(entry.amount).toString())
  const [categoryId, setCategoryId] = useState(entry.category_id.toString())
  const [date, setDate] = useState(entry.entry_date.split("T")[0])

  function handleSave() {
    const absAmount = parseFloat(amount) || 0
    onSave({
      description,
      amount: isExpense ? -absAmount : absAmount,
      category_id: parseInt(categoryId),
      entry_date: date,
    })
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex gap-1">
        <Button
          type="button"
          size="sm"
          variant={isExpense ? "default" : "outline"}
          className={isExpense ? "bg-red-600 hover:bg-red-700" : ""}
          onClick={() => setIsExpense(true)}
        >
          Expense
        </Button>
        <Button
          type="button"
          size="sm"
          variant={!isExpense ? "default" : "outline"}
          className={!isExpense ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          onClick={() => setIsExpense(false)}
        >
          Income
        </Button>
      </div>

      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-9 w-28"
        placeholder="0.00"
      />

      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="h-9 w-48"
        placeholder="Description"
      />

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="h-9 w-36"
      />

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9"
          onClick={handleSave}
        >
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9"
          onClick={onCancel}
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  )
}
