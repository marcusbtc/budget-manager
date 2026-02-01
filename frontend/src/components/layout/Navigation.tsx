import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, List, TrendingUp, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Entries", href: "/entries", icon: List },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
