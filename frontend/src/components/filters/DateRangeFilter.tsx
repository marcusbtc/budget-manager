import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"

interface DateRangeFilterProps {
  startDate?: string
  endDate?: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onClear?: () => void
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="space-y-2">
        <Label htmlFor="start-date" className="text-sm font-medium">
          Start Date
        </Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="start-date"
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="pl-10 w-[180px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date" className="text-sm font-medium">
          End Date
        </Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="end-date"
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="pl-10 w-[180px]"
          />
        </div>
      </div>

      {(startDate || endDate) && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-10">
          Clear
        </Button>
      )}
    </div>
  )
}
