import { Navigation } from "./Navigation"
import { Wallet } from "lucide-react"
import { useLocation } from "react-router-dom"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/entries": "Entries",
  "/budget": "Budget",
  "/analytics": "Analytics",
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || "Budget Manager"

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full border-b bg-background md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-16 items-center border-b px-6">
          <Wallet className="mr-2 h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Budget Manager</span>
        </div>
        <div className="p-4">
          <Navigation />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b px-6 flex items-center">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
