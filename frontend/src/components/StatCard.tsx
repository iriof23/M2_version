import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: number | string
    trend?: string
    trendUp?: boolean
    badge?: number
    badgeLabel?: string
    subtitle?: string
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
    subtitle,
    variant = 'default'
}: StatCardProps) {

    // Premium Solid Color Configuration
    const styles = {
        default: {
            border: 'border-slate-200',
            gradient: 'from-white to-slate-50/50',
            iconColor: 'text-slate-400', // Muted for default
            valueColor: 'text-slate-900',
            badge: 'bg-slate-100 text-slate-700'
        },
        success: {
            border: 'border-emerald-100',
            gradient: 'from-white to-emerald-50/50',
            iconColor: 'text-emerald-500', // Bright emerald
            valueColor: 'text-slate-900',
            badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
        },
        warning: {
            border: 'border-amber-100',
            gradient: 'from-white to-amber-50/50',
            iconColor: 'text-amber-500', // Bright amber
            valueColor: 'text-slate-900',
            badge: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
        },
        destructive: {
            border: 'border-red-100',
            gradient: 'from-white to-red-50/50',
            iconColor: 'text-red-500', // Bright red
            valueColor: 'text-slate-900',
            badge: 'bg-gradient-to-r from-red-600 to-red-700 text-white'
        },
    }[variant]

    // Clone icon for watermark (large) and regular (small)
    const WatermarkIcon = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 1 })
        : icon

    const DisplayIcon = React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { className: cn("w-6 h-6", styles.iconColor) })
        : icon

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
            styles.border,
            "bg-gradient-to-br", styles.gradient
        )}>
            {/* Watermark Icon (Background) */}
            <div className={cn(
                "absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.03] transform rotate-12 pointer-events-none select-none",
                "text-slate-900" // Use dark text for watermark so it's subtle gray
            )}>
                {React.isValidElement(WatermarkIcon) && React.cloneElement(WatermarkIcon as React.ReactElement<any>, { className: "w-full h-full" })}
            </div>

            <CardContent className="p-5 relative z-10">
                <div className="flex flex-col h-full justify-between">
                    {/* Header: Label & Icon */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                {label}
                            </span>
                            {/* Subtitle or secondary badge moved here if needed */}
                        </div>
                        <div className={cn("p-2 rounded-lg bg-white shadow-sm border border-slate-100")}>
                            {DisplayIcon}
                        </div>
                    </div>

                    {/* Main Value Section */}
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className={cn("text-3xl font-bold tracking-tight", styles.valueColor)}>
                                {value}
                            </span>
                            {subtitle && (
                                <span className="text-xs font-medium text-slate-400">
                                    {subtitle}
                                </span>
                            )}
                        </div>

                        {/* Footer: Trends / Badges */}
                        {(trend || (badge !== undefined && badge > 0)) && (
                            <div className="flex items-center gap-2 mt-2">
                                {trend && (
                                    <div className={cn(
                                        "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                        trendUp
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-600"
                                    )}>
                                        {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {trend}
                                    </div>
                                )}
                                {badge !== undefined && badge > 0 && (
                                    <div className={cn(
                                        "flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm",
                                        styles.badge
                                    )}>
                                        {badge} {badgeLabel}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
