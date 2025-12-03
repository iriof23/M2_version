import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calculator, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CVSSCalculatorProps {
    vector: string
    onUpdate: (vector: string, score: number, severity: string) => void
    className?: string
}

// CVSS 3.1 Base Metrics
const METRICS = {
    AV: { 
        name: 'Attack Vector', 
        description: 'How the vulnerability is exploited',
        options: { 
            N: { label: 'Network', value: 0.85 }, 
            A: { label: 'Adjacent', value: 0.62 }, 
            L: { label: 'Local', value: 0.55 }, 
            P: { label: 'Physical', value: 0.2 } 
        } 
    },
    AC: { 
        name: 'Attack Complexity', 
        description: 'Conditions beyond attacker control',
        options: { 
            L: { label: 'Low', value: 0.77 }, 
            H: { label: 'High', value: 0.44 } 
        } 
    },
    PR: { 
        name: 'Privileges Required', 
        description: 'Level of privileges needed',
        options: { 
            N: { label: 'None', value: 0.85 }, 
            L: { label: 'Low', value: 0.62 }, 
            H: { label: 'High', value: 0.27 } 
        } 
    },
    UI: { 
        name: 'User Interaction', 
        description: 'User participation required',
        options: { 
            N: { label: 'None', value: 0.85 }, 
            R: { label: 'Required', value: 0.62 } 
        } 
    },
    S: { 
        name: 'Scope', 
        description: 'Impact beyond vulnerable component',
        options: { 
            U: { label: 'Unchanged', value: 0 }, 
            C: { label: 'Changed', value: 1 } 
        } 
    },
    C: { 
        name: 'Confidentiality', 
        description: 'Impact to information secrecy',
        options: { 
            N: { label: 'None', value: 0 }, 
            L: { label: 'Low', value: 0.22 }, 
            H: { label: 'High', value: 0.56 } 
        } 
    },
    I: { 
        name: 'Integrity', 
        description: 'Impact to data trustworthiness',
        options: { 
            N: { label: 'None', value: 0 }, 
            L: { label: 'Low', value: 0.22 }, 
            H: { label: 'High', value: 0.56 } 
        } 
    },
    A: { 
        name: 'Availability', 
        description: 'Impact to system availability',
        options: { 
            N: { label: 'None', value: 0 }, 
            L: { label: 'Low', value: 0.22 }, 
            H: { label: 'High', value: 0.56 } 
        } 
    }
}

// CVSS 3.1 Calculation (Official Formula)
function calculateCVSS31(metrics: Record<string, string>): number {
    const AV = METRICS.AV.options[metrics.AV as keyof typeof METRICS.AV.options]?.value ?? 0.85
    const AC = METRICS.AC.options[metrics.AC as keyof typeof METRICS.AC.options]?.value ?? 0.77
    const PR_base = METRICS.PR.options[metrics.PR as keyof typeof METRICS.PR.options]?.value ?? 0.85
    const UI = METRICS.UI.options[metrics.UI as keyof typeof METRICS.UI.options]?.value ?? 0.85
    const S = metrics.S === 'C' ? 1 : 0
    const C = METRICS.C.options[metrics.C as keyof typeof METRICS.C.options]?.value ?? 0
    const I = METRICS.I.options[metrics.I as keyof typeof METRICS.I.options]?.value ?? 0
    const A = METRICS.A.options[metrics.A as keyof typeof METRICS.A.options]?.value ?? 0

    // Adjust PR based on Scope
    let PR = PR_base
    if (S === 1) { // Scope Changed
        if (metrics.PR === 'L') PR = 0.68
        else if (metrics.PR === 'H') PR = 0.50
    }

    // Calculate ISS (Impact Sub-Score)
    const ISS = 1 - ((1 - C) * (1 - I) * (1 - A))
    
    // Calculate Impact
    let Impact: number
    if (S === 0) { // Scope Unchanged
        Impact = 6.42 * ISS
    } else { // Scope Changed
        Impact = 7.52 * (ISS - 0.029) - 3.25 * Math.pow(ISS - 0.02, 15)
    }

    // Calculate Exploitability
    const Exploitability = 8.22 * AV * AC * PR * UI

    // Calculate Base Score
    let BaseScore: number
    if (Impact <= 0) {
        BaseScore = 0
    } else if (S === 0) {
        BaseScore = Math.min(Impact + Exploitability, 10)
    } else {
        BaseScore = Math.min(1.08 * (Impact + Exploitability), 10)
    }

    // Round up to 1 decimal place (CVSS standard)
    return Math.ceil(BaseScore * 10) / 10
}

function getSeverityFromScore(score: number): string {
    if (score >= 9.0) return 'Critical'
    if (score >= 7.0) return 'High'
    if (score >= 4.0) return 'Medium'
    if (score > 0) return 'Low'
    return 'Informational'
}

function getSeverityColor(score: number): string {
    if (score >= 9.0) return 'bg-gradient-to-r from-red-600 to-red-700 text-white'
    if (score >= 7.0) return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
    if (score >= 4.0) return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
    if (score > 0) return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
    return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
}

function getSeverityBorder(score: number): string {
    if (score >= 9.0) return 'border-red-200 hover:border-red-300'
    if (score >= 7.0) return 'border-orange-200 hover:border-orange-300'
    if (score >= 4.0) return 'border-amber-200 hover:border-amber-300'
    if (score > 0) return 'border-emerald-200 hover:border-emerald-300'
    return 'border-slate-200 hover:border-slate-300'
}

export default function CVSSCalculator({ vector, onUpdate, className }: CVSSCalculatorProps) {
    const [metrics, setMetrics] = useState<Record<string, string>>({
        AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'N', I: 'N', A: 'N'
    })
    const [score, setScore] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    // Parse vector string on init or when it changes externally
    useEffect(() => {
        if (vector && vector.startsWith('CVSS:3.1/')) {
            const parts = vector.replace('CVSS:3.1/', '').split('/')
            const newMetrics: Record<string, string> = { ...metrics }
            parts.forEach(part => {
                const [key, value] = part.split(':')
                if (key && value && key in METRICS) {
                    newMetrics[key] = value
                }
            })
            setMetrics(newMetrics)
            const newScore = calculateCVSS31(newMetrics)
            setScore(newScore)
        }
    }, [vector])

    const updateMetric = (key: string, value: string) => {
        const newMetrics = { ...metrics, [key]: value }
        setMetrics(newMetrics)
        
        const newScore = calculateCVSS31(newMetrics)
        setScore(newScore)
        // Don't call onUpdate here - wait for explicit "Apply Score" click
    }

    const handleApply = () => {
        const vectorString = `CVSS:3.1/${Object.entries(metrics).map(([k, v]) => `${k}:${v}`).join('/')}`
        const severity = getSeverityFromScore(score)
        onUpdate(vectorString, score, severity)
        
        // Close the popover after a short delay to ensure state updates propagate
        setTimeout(() => setIsOpen(false), 100)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                        "h-8 px-2.5 border transition-all duration-200",
                        getSeverityBorder(score),
                        "bg-white hover:bg-slate-50",
                        className
                    )}
                >
                    <Calculator className="w-3.5 h-3.5 text-slate-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[420px] p-0 bg-white border-slate-200 shadow-xl rounded-xl overflow-hidden" 
                align="start"
                sideOffset={8}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900">CVSS v3.1 Calculator</h4>
                                <p className="text-[10px] text-slate-500">Common Vulnerability Scoring System</p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm",
                            getSeverityColor(score)
                        )}>
                            {score.toFixed(1)} <span className="font-medium text-xs opacity-90">{getSeverityFromScore(score)}</span>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(METRICS).map(([key, { name, options }]) => {
                            const selectedOption = options[metrics[key] as keyof typeof options] as { label: string; value: number } | undefined
                            return (
                                <div key={key} className="space-y-1.5">
                                    <Label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                        {name}
                                    </Label>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(options).map(([optKey, optValue]) => (
                                            <button
                                                key={optKey}
                                                onClick={() => updateMetric(key, optKey)}
                                                className={cn(
                                                    "px-2 py-1 text-[10px] font-medium rounded-md border transition-all duration-150",
                                                    metrics[key] === optKey
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-100"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                )}
                                                title={(optValue as { label: string }).label}
                                            >
                                                {optKey}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Show selected option label */}
                                    <p className="text-[9px] text-slate-400">
                                        {selectedOption?.label || '—'}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                        {`CVSS:3.1/${Object.entries(metrics).map(([k, v]) => `${k}:${v}`).join('/')}`}
                    </p>
                    <Button 
                        size="sm" 
                        onClick={handleApply}
                        className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Apply Score
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// Named export for easier imports
export { CVSSCalculator }
