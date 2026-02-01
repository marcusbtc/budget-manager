import { useState } from "react"
import { motion } from "framer-motion"
import { BudgetTable } from "@/components/budget/BudgetTable"
import { EntryFormDialog } from "@/components/entries/EntryFormDialog"
import { CategoryManager } from "@/components/categories/CategoryManager"
import { DateRangeFilter } from "@/components/filters/DateRangeFilter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { fadeInUp } from "@/animations/variants"

export function BudgetPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget Entries</h2>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={handleClear}
          />
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetTable startDate={startDate} endDate={endDate} />
        </div>
        <div>
          <CategoryManager />
        </div>
      </div>

      <EntryFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </motion.div>
  )
}
