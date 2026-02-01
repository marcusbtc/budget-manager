import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { MonthlyTrend } from "@/types"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { LoadingCard } from "./LoadingCard"

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value)
}

function formatTooltipValue(value: number | undefined): string {
  return value !== undefined ? formatCurrency(value) : "$0.00"
}

interface MonthlyTrendChartProps {
  data?: MonthlyTrend[]
  isLoading?: boolean
}

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
  if (isLoading) return <LoadingCard />

  const chartData = data?.map((item) => ({
    month: item.month,
    income: item.total_income,
    expenses: item.total_expenses,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCompactCurrency} />
            <Tooltip formatter={formatTooltipValue} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorIncome)"
              name="Income"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpenses)"
              name="Expenses"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
