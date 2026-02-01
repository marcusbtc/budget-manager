export interface Category {
  id: number
  name: string
  color: string
  icon: string
  is_default: boolean
}

export interface CategoryCreate {
  name: string
  color: string
  icon?: string
}

export interface CategoryUpdate {
  name?: string
  color?: string
  icon?: string
}

export interface BudgetEntry {
  id: number
  category_id: number
  amount: number
  description: string
  entry_date: string
  created_at: string
  updated_at: string
}

export interface BudgetEntryCreate {
  category_id: number
  amount: number
  description: string
  entry_date?: string
}

export interface BudgetEntryUpdate {
  category_id?: number
  amount?: number
  description?: string
  entry_date?: string
}

export interface BudgetStats {
  total_balance: number
  total_income: number
  total_expenses: number
  entry_count: number
}

export interface CategoryStat {
  category_id: number
  category_name: string
  category_color: string
  total_amount: number
  entry_count: number
}

export interface MonthlyTrend {
  month: string
  total_income: number
  total_expenses: number
  net_balance: number
}
