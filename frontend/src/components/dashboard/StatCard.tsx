import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { fadeInUp } from "@/animations/variants"

interface AnimatedNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  isCurrency?: boolean
}

function AnimatedNumber({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  isCurrency = false,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      setDisplayValue(progress * value)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration, isInView])

  const formatted = isCurrency
    ? formatCurrency(displayValue)
    : Math.round(displayValue).toLocaleString()

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

interface StatCardProps {
  title: string
  value: number
  description?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  loading?: boolean
  isCurrency?: boolean
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  loading,
  isCurrency = true,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const trendColor =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
      ? "text-red-500"
      : "text-muted-foreground"

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden h-full">
        <div
          className={`absolute inset-0 opacity-5 ${
            trend === "up"
              ? "bg-emerald-500"
              : trend === "down"
              ? "bg-red-500"
              : "bg-primary"
          }`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={value} isCurrency={isCurrency} />
          </div>
          {description && (
            <p className={`text-xs mt-1 ${trendColor}`}>{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
