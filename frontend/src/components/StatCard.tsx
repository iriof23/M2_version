import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: number
    trend?: string
    trendUp?: boolean
    badge?: number
    badgeLabel?: string
    variant?: 'default' | 'warning' | 'destructive' | 'success'
}

export function StatCard({
    icon,
    label,
    value,
    trend,
    trendUp,
    badge,
    badgeLabel,
    variant = 'default'
}: StatCardProps) {

    const getVariantStyles = () => {
        switch (variant) {
            case 'destructive':
                return {
                    iconColor: 'text-red-500',
                    trendColor: 'text-red-500',
                    trendBg: 'bg-red-500/10',
                }
            case 'warning':
                return {
                    iconColor: 'text-orange-500',
                    trendColor: 'text-orange-500',
                    trendBg: 'bg-orange-500/10',
                }
            case 'success':
                return {
                    iconColor: 'text-emerald-500',
                    trendColor: 'text-emerald-500',
                    trendBg: 'bg-emerald-500/10',
                }
            case 'default':
            default:
                return {
                    iconColor: 'text-white',
                    trendColor: 'text-zinc-400',
                    trendBg: 'bg-zinc-800',
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <Card
            className={cn(
                "relative overflow-hidden",
                "bg-zinc-900/50",
                "border-zinc-800",
                "transition-all duration-200 hover:border-zinc-700",
                "border"
            )}
        >
            <CardContent className="p-6">
                {/* Top Section: Icon and Trend/Badge */}
                <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <div className={cn("p-2 rounded-lg bg-zinc-900 border border-zinc-800", styles.iconColor)}>
                        {icon}
                    </div>

                    {/* Trend or Badge */}
                    {trend && (
                        <div
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent",
                                trendUp
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                            )}
                        >
                            {trendUp ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {trend}
                        </div>
                    )}

                    {badge !== undefined && badge > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                            {badge} {badgeLabel}
                        </div>
                    )}
                </div>

                {/* Bottom Section: Value and Label */}
                <div>
                    <h3 className="text-3xl font-bold tracking-tight text-white mb-1">
                        {value}
                    </h3>
                    <p className="text-sm font-medium text-zinc-500">
                        {label}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
