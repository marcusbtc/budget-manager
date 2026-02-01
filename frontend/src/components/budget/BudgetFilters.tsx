import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-picker"
import { useCategories } from "@/hooks/useBudget"
import { fadeInUp } from "@/animations/variants"
import { Filter, X } from "lucide-react"

interface BudgetFiltersProps {
  onFilterChange: (filters: {
    search: string
    categoryId: string
    startDate?: Date
    endDate?: Date
  }) => void
}

export function BudgetFilters({ onFilterChange }: BudgetFiltersProps) {
  const { data: categories } = useCategories()
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const handleApplyFilters = () => {
    onFilterChange({
      search,
      categoryId: categoryId === "all" ? "" : categoryId,
      startDate,
      endDate,
    })
  }

  const handleClearFilters = () => {
    setSearch("")
    setCategoryId("all")
    setStartDate(undefined)
    setEndDate(undefined)
    onFilterChange({
      search: "",
      categoryId: "",
      startDate: undefined,
      endDate: undefined,
    })
  }

  const hasFilters = search || categoryId !== "all" || startDate || endDate

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-4 rounded-lg border p-4"
    >
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          {hasFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
