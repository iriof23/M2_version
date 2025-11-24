import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export interface FilterConfig {
    [key: string]: {
        label: string
        type: 'select' | 'multiselect' | 'daterange'
        options?: string[]
    }
}

export interface ActiveFilters {
    [key: string]: string | string[] | { start?: Date, end?: Date }
}

interface FilterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    filterConfig: FilterConfig
    activeFilters: ActiveFilters
    onApplyFilters: (filters: ActiveFilters) => void
    title?: string
    description?: string
}

export function FilterDialog({
    open,
    onOpenChange,
    filterConfig,
    activeFilters,
    onApplyFilters,
    title = 'Filter',
    description = 'Apply filters to refine your results'
}: FilterDialogProps) {
    const [tempFilters, setTempFilters] = useState<ActiveFilters>(activeFilters)

    const updateFilter = (key: string, value: any) => {
        setTempFilters(prev => ({ ...prev, [key]: value }))
    }

    const toggleMultiSelect = (key: string, value: string) => {
        const current = (tempFilters[key] as string[]) || []
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        updateFilter(key, updated)
    }

    const clearFilter = (key: string) => {
        const { [key]: _, ...rest } = tempFilters
        setTempFilters(rest)
    }

    const clearAllFilters = () => {
        setTempFilters({})
    }

    const handleApply = () => {
        onApplyFilters(tempFilters)
        onOpenChange(false)
    }

    const activeFilterCount = Object.keys(tempFilters).filter(key => {
        const value = tempFilters[key]
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object' && value !== null) {
            return !!(value as any).start || !!(value as any).end
        }
        return !!value
    }).length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        {title}
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFilterCount} active
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {Object.entries(filterConfig).map(([key, config]) => (
                        <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>{config.label}</Label>
                                {tempFilters[key] && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearFilter(key)}
                                        className="h-auto p-1 text-xs"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>

                            {config.type === 'select' && (
                                <Select
                                    value={tempFilters[key] as string || ''}
                                    onValueChange={(value) => updateFilter(key, value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select ${config.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {config.options?.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {config.type === 'multiselect' && (
                                <div className="flex flex-wrap gap-2">
                                    {config.options?.map((option) => {
                                        const isSelected = ((tempFilters[key] as string[]) || []).includes(option)
                                        return (
                                            <Badge
                                                key={option}
                                                variant={isSelected ? 'default' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => toggleMultiSelect(key, option)}
                                            >
                                                {option}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            )}

                            {config.type === 'daterange' && (
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'flex-1 justify-start text-left font-normal',
                                                    !(tempFilters[key] as any)?.start && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {(tempFilters[key] as any)?.start
                                                    ? format((tempFilters[key] as any).start, 'PPP')
                                                    : 'Start date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={(tempFilters[key] as any)?.start}
                                                onSelect={(date) =>
                                                    updateFilter(key, {
                                                        ...(tempFilters[key] as any),
                                                        start: date
                                                    })
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'flex-1 justify-start text-left font-normal',
                                                    !(tempFilters[key] as any)?.end && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {(tempFilters[key] as any)?.end
                                                    ? format((tempFilters[key] as any).end, 'PPP')
                                                    : 'End date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={(tempFilters[key] as any)?.end}
                                                onSelect={(date) =>
                                                    updateFilter(key, {
                                                        ...(tempFilters[key] as any),
                                                        end: date
                                                    })
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={clearAllFilters}>
                        Clear All
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApply}>
                            Apply Filters
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
