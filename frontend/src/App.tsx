import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AppShell } from "@/components/layout/AppShell"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { DashboardPage } from "@/pages/DashboardPage"
import { EntriesPage } from "@/pages/EntriesPage"
import { BudgetPage } from "@/pages/BudgetPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/entries" element={<EntriesPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
