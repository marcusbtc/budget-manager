import { motion } from "framer-motion"
import { useState } from "react"
import { StatsOverview } from "@/components/dashboard/StatsOverview"
import { MonthlyTrendChart, CategoryBreakdownChart } from "@/components/dashboard/charts"
import { EntryList } from "@/components/entries/EntryList"
import { DateRangeFilter } from "@/components/filters/DateRangeFilter"
import { useSummaryStats, useMonthlyTrend, useCategoryStats } from "@/hooks/useBudget"
import { fadeInUp, staggerContainer } from "@/animations/variants"

export function DashboardPage() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const { data: stats, isLoading: statsLoading } = useSummaryStats(startDate, endDate)
  const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend(6, startDate, endDate)
  const { data: categoryStats, isLoading: categoryLoading } = useCategoryStats(startDate, endDate)

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your finances</p>
        </div>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClear}
        />
      </div>

      <StatsOverview stats={stats} isLoading={statsLoading} />
      
      <motion.div 
        variants={fadeInUp}
        className="grid gap-6 lg:grid-cols-2"
      >
        <MonthlyTrendChart data={monthlyTrend} isLoading={trendLoading} />
        <CategoryBreakdownChart data={categoryStats} isLoading={categoryLoading} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <EntryList />
      </motion.div>
    </motion.div>
  )
}
