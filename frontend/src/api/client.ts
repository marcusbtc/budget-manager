import type { BudgetEntry, BudgetEntryCreate, BudgetEntryUpdate, BudgetStats, Category, CategoryCreate, CategoryUpdate, CategoryStat, MonthlyTrend } from "@/types"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
const REQUEST_TIMEOUT = 10000 // 10 seconds

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`)
    }
    throw error
  }
}

async function handleResponse<T>(response: Response, context: string): Promise<T> {
  if (!response.ok) {
    let errorMessage = `${context} failed`
    try {
      const errorData = await response.json()
      errorMessage = errorData.detail || `${context} failed (${response.status})`
    } catch {
      errorMessage = `${context} failed (${response.status}: ${response.statusText})`
    }
    throw new Error(errorMessage)
  }
  return response.json() as Promise<T>
}

export const budgetApi = {
  getEntries: async (startDate?: string, endDate?: string): Promise<BudgetEntry[]> => {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    const query = params.toString() ? `?${params.toString()}` : ""
    
    const response = await fetchWithTimeout(`${API_BASE}/budgets/${query}`)
    return handleResponse(response, "Fetch entries")
  },

  createEntry: async (entry: BudgetEntryCreate): Promise<BudgetEntry> => {
    const response = await fetchWithTimeout(`${API_BASE}/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    })
    return handleResponse(response, "Create entry")
  },

  updateEntry: async (id: number, entry: BudgetEntryUpdate): Promise<BudgetEntry> => {
    const response = await fetchWithTimeout(`${API_BASE}/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    })
    return handleResponse(response, "Update entry")
  },

  deleteEntry: async (id: number): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE}/budgets/${id}`, {
      method: "DELETE",
    })
    await handleResponse(response, "Delete entry")
  },
}

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetchWithTimeout(`${API_BASE}/categories/`)
    return handleResponse(response, "Fetch categories")
  },

  createCategory: async (category: CategoryCreate): Promise<Category> => {
    const response = await fetchWithTimeout(`${API_BASE}/categories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    return handleResponse(response, "Create category")
  },

  updateCategory: async (id: number, category: CategoryUpdate): Promise<Category> => {
    const response = await fetchWithTimeout(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    return handleResponse(response, "Update category")
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetchWithTimeout(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    })
    await handleResponse(response, "Delete category")
  },
}

export const statsApi = {
  getSummary: async (startDate?: string, endDate?: string): Promise<BudgetStats> => {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    const query = params.toString() ? `?${params.toString()}` : ""
    
    const response = await fetchWithTimeout(`${API_BASE}/stats/summary${query}`)
    return handleResponse(response, "Fetch summary stats")
  },

  getByCategory: async (startDate?: string, endDate?: string): Promise<CategoryStat[]> => {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    const query = params.toString() ? `?${params.toString()}` : ""
    
    const response = await fetchWithTimeout(`${API_BASE}/stats/by-category${query}`)
    return handleResponse(response, "Fetch category stats")
  },

  getMonthlyTrend: async (months: number = 6, startDate?: string, endDate?: string): Promise<MonthlyTrend[]> => {
    const params = new URLSearchParams()
    params.append("months", months.toString())
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    
    const response = await fetchWithTimeout(`${API_BASE}/stats/monthly-trend?${params.toString()}`)
    return handleResponse(response, "Fetch monthly trend")
  },
}
