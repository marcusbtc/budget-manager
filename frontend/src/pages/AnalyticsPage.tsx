import { MonthlyTrendChart, CategoryBreakdownChart } from "@/components/dashboard/charts"
import { DateRangeFilter } from "@/components/filters/DateRangeFilter"
import { useMonthlyTrend, useCategoryStats } from "@/hooks/useBudget"
import { useState } from "react"

export function AnalyticsPage() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend(12, startDate, endDate)
  const { data: categoryStats, isLoading: categoryLoading } = useCategoryStats(startDate, endDate)

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed financial analysis</p>
        </div>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClear}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyTrendChart data={monthlyTrend} isLoading={trendLoading} />
        <CategoryBreakdownChart data={categoryStats} isLoading={categoryLoading} />
      </div>
    </div>
  )
}
