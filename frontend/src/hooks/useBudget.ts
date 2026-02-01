import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { budgetApi, categoryApi, statsApi } from "@/api/client"
import type { BudgetEntryCreate, BudgetEntryUpdate, CategoryCreate, CategoryUpdate } from "@/types"
import { toast } from "sonner"

export function useBudgetEntries(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["budgetEntries", startDate, endDate],
    queryFn: () => budgetApi.getEntries(startDate, endDate),
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) return false
      return failureCount < 3
    },
  })
}

export function useCreateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BudgetEntryCreate) => budgetApi.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetEntries"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      toast.success("Entry created successfully")
    },
    onError: () => {
      toast.error("Failed to create entry")
    },
  })
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BudgetEntryUpdate }) =>
      budgetApi.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetEntries"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      toast.success("Entry updated successfully")
    },
    onError: () => {
      toast.error("Failed to update entry")
    },
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => budgetApi.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetEntries"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      toast.success("Entry deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete entry")
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
    staleTime: 60000, // 1 minute - categories don't change often
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) return false
      return failureCount < 3
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryCreate) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created successfully")
    },
    onError: () => {
      toast.error("Failed to create category")
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category updated successfully")
    },
    onError: () => {
      toast.error("Failed to update category")
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete category")
    },
  })
}

export function useSummaryStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["stats", "summary", startDate, endDate],
    queryFn: () => statsApi.getSummary(startDate, endDate),
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) return false
      return failureCount < 3
    },
  })
}

export function useCategoryStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["stats", "category", startDate, endDate],
    queryFn: () => statsApi.getByCategory(startDate, endDate),
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) return false
      return failureCount < 3
    },
  })
}

export function useMonthlyTrend(months: number = 6, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["stats", "monthly", months, startDate, endDate],
    queryFn: () => statsApi.getMonthlyTrend(months, startDate, endDate),
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) return false
      return failureCount < 3
    },
  })
}
