import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { CategoryStat } from "@/types"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { LoadingCard } from "./LoadingCard"

interface CategoryBreakdownChartProps {
  data?: CategoryStat[]
  isLoading?: boolean
}

function formatTooltipValue(value: number | undefined): string {
  return value !== undefined ? formatCurrency(value) : "$0.00"
}

export function CategoryBreakdownChart({ data, isLoading }: CategoryBreakdownChartProps) {
  if (isLoading) return <LoadingCard />

  const incomeData = data
    ?.filter((item) => item.total_amount > 0)
    .map((item) => ({
      name: item.category_name,
      value: item.total_amount,
    }))
    .sort((a, b) => b.value - a.value)

  const expenseData = data
    ?.filter((item) => item.total_amount < 0)
    .map((item) => ({
      name: item.category_name,
      value: Math.abs(item.total_amount),
    }))
    .sort((a, b) => b.value - a.value)

  const hasIncome = incomeData && incomeData.length > 0
  const hasExpenses = expenseData && expenseData.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {hasIncome && (
            <div>
              <h4 className="text-sm font-medium text-emerald-600 mb-2">Income by Category</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={incomeData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {incomeData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill="#10b981" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {hasExpenses && (
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Expenses by Category</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={expenseData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {expenseData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ef4444" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {!hasIncome && !hasExpenses && (
            <div className="col-span-2 flex items-center justify-center h-[200px] text-muted-foreground">
              No category data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
