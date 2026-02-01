import { Badge } from "@/components/ui/badge"

interface TypeBadgeProps {
  amount: number
}

export function TypeBadge({ amount }: TypeBadgeProps) {
  const isExpense = amount < 0

  if (isExpense) {
    return <Badge variant="destructive">Expense</Badge>
  }

  return (
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
      Income
    </Badge>
  )
}
