import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react"
import type { BudgetStats } from "@/types"
import { StatCard } from "./StatCard"
import { motion } from "framer-motion"
import { staggerContainer } from "@/animations/variants"

interface StatsOverviewProps {
  stats?: BudgetStats
  isLoading?: boolean
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  const trend = stats
    ? stats.total_balance >= 0
      ? "up"
      : "down"
    : "neutral"

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        title="Total Balance"
        value={stats?.total_balance || 0}
        description={stats ? (stats.total_balance >= 0 ? "Positive balance" : "Negative balance") : undefined}
        icon={<Wallet className="h-4 w-4" />}
        trend={trend}
        loading={isLoading}
      />
      <StatCard
        title="Total Income"
        value={stats?.total_income || 0}
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
        loading={isLoading}
      />
      <StatCard
        title="Total Expenses"
        value={stats?.total_expenses || 0}
        icon={<TrendingDown className="h-4 w-4" />}
        trend="down"
        loading={isLoading}
      />
      <StatCard
        title="Total Entries"
        value={stats?.entry_count || 0}
        icon={<Receipt className="h-4 w-4" />}
        loading={isLoading}
        isCurrency={false}
      />
    </motion.div>
  )
}
