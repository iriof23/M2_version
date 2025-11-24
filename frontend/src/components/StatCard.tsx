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
    gradientFrom: string
    gradientTo: string
    iconColor: string
}

export function StatCard({
    icon,
    label,
    value,
    trend,
    trendUp,
    badge,
    badgeLabel,
    gradientFrom,
    gradientTo,
    iconColor
}: StatCardProps) {
    return (
        <Card
            className={cn(
                "relative overflow-hidden bg-[#1a1d21] border-gray-800 text-white",
                "transition-all duration-200 hover:scale-[1.02] hover:shadow-xl",
                "border-l-4"
            )}
            style={{
                borderLeftColor: gradientFrom
            }}
        >
            <CardContent className="p-6">
                {/* Top Section: Icon and Trend/Badge */}
                <div className="flex items-start justify-between mb-4">
                    {/* Icon with gradient background */}
                    <div
                        className="p-3 rounded-xl"
                        style={{
                            background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`
                        }}
                    >
                        <div style={{ color: iconColor }}>
                            {icon}
                        </div>
                    </div>

                    {/* Trend or Badge */}
                    {trend && (
                        <div
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                                trendUp
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/20 text-red-400"
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
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 animate-pulse">
                            {badge} {badgeLabel}
                        </div>
                    )}
                </div>

                {/* Bottom Section: Value and Label */}
                <div>
                    <h3 className="text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {value}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                        {label}
                    </p>
                </div>

                {/* Subtle gradient overlay in background */}
                <div
                    className="absolute bottom-0 right-0 w-32 h-32 opacity-5 rounded-full blur-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                    }}
                />
            </CardContent>
        </Card>
    )
}

// Predefined color schemes for consistency
export const statCardColors = {
    blue: {
        gradientFrom: '#3b82f6',
        gradientTo: '#06b6d4',
        iconColor: '#60a5fa'
    },
    green: {
        gradientFrom: '#10b981',
        gradientTo: '#14b8a6',
        iconColor: '#34d399'
    },
    purple: {
        gradientFrom: '#a855f7',
        gradientTo: '#ec4899',
        iconColor: '#c084fc'
    },
    yellow: {
        gradientFrom: '#eab308',
        gradientTo: '#f97316',
        iconColor: '#fbbf24'
    },
    red: {
        gradientFrom: '#ef4444',
        gradientTo: '#f43f5e',
        iconColor: '#f87171'
    }
}
