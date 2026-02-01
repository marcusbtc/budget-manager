import { formatCurrency } from "@/lib/utils"

interface AmountCellProps {
  amount: number
}

export function AmountCell({ amount }: AmountCellProps) {
  const isExpense = amount < 0
  const colorClass = isExpense ? "text-red-600" : "text-emerald-600"

  return (
    <span className={`font-medium ${colorClass}`}>
      {formatCurrency(amount)}
    </span>
  )
}
