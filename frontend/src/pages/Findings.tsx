import { useState } from 'react'
import {
    Search,
    Plus,
    X,
    FileJson,
    Copy,
    CheckCircle2,
    Shield,
    Smartphone,
    Globe,
    Server,
    Database,
    Cpu,
    FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { vulnerabilityDatabase, Vulnerability } from '../data/vulnerabilities'

export default function Findings() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [selectedSeverity, setSelectedSeverity] = useState<string>('All')
    const [reportCart, setReportCart] = useState<Vulnerability[]>([])
    const [showCopiedToast, setShowCopiedToast] = useState(false)

    // Filter Logic
    const filteredFindings = vulnerabilityDatabase.filter(finding => {
        const matchesSearch = finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            finding.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            finding.owasp_reference.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || finding.category === selectedCategory
        const matchesSeverity = selectedSeverity === 'All' || finding.severity === selectedSeverity

        return matchesSearch && matchesCategory && matchesSeverity
    })

    // Cart Logic
    const addToCart = (finding: Vulnerability) => {
        if (!reportCart.find(f => f.id === finding.id)) {
            setReportCart([...reportCart, finding])
        }
    }

    const removeFromCart = (id: string) => {
        setReportCart(reportCart.filter(f => f.id !== id))
    }

    // Export Logic
    const exportJSON = () => {
        const dataStr = JSON.stringify(reportCart, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const exportFileDefaultName = 'vulnerability_report.json'

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const copyMarkdown = () => {
        let markdown = '# Vulnerability Report\n\n'
        reportCart.forEach(finding => {
            markdown += `## ${finding.title}\n`
            markdown += `**Severity:** ${finding.severity}\n`
            markdown += `**OWASP Reference:** ${finding.owasp_reference}\n\n`
            markdown += `### Description\n${finding.description}\n\n`
            markdown += `### Impact\n${finding.impact}\n\n`
            markdown += `### Recommendation\n${finding.recommendation}\n\n`
            markdown += '---\n\n'
        })
        navigator.clipboard.writeText(markdown)
        setShowCopiedToast(true)
        setTimeout(() => setShowCopiedToast(false), 3000)
    }

    // Helper for Severity Colors
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
            case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
            case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
        }
    }

    // Helper for Category Icons
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Web': return <Globe className="w-4 h-4" />
            case 'API': return <Server className="w-4 h-4" />
            case 'Mobile': return <Smartphone className="w-4 h-4" />
            case 'LLM': return <Cpu className="w-4 h-4" />
            default: return <Database className="w-4 h-4" />
        }
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Findings Database</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Browse standard vulnerabilities and build your report
                </p>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Left Column: Findings Library */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search findings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                <SelectItem value="Web">Web</SelectItem>
                                <SelectItem value="API">API</SelectItem>
                                <SelectItem value="Mobile">Mobile</SelectItem>
                                <SelectItem value="LLM">LLM</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Severities</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Findings List */}
                    <ScrollArea className="flex-1 pr-4">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredFindings.map((finding) => (
                                <Card key={finding.id} className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: finding.severity === 'Critical' ? '#EF4444' : finding.severity === 'High' ? '#F97316' : finding.severity === 'Medium' ? '#EAB308' : '#22C55E' }}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg">{finding.title}</CardTitle>
                                                    <Badge variant="outline" className={cn("flex items-center gap-1", getSeverityColor(finding.severity))}>
                                                        {finding.severity}
                                                    </Badge>
                                                    <Badge variant="secondary" className="flex items-center gap-1">
                                                        {getCategoryIcon(finding.category)}
                                                        {finding.category}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="font-mono text-xs">
                                                    {finding.owasp_reference}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={reportCart.find(f => f.id === finding.id) ? "secondary" : "default"}
                                                onClick={() => addToCart(finding)}
                                                disabled={!!reportCart.find(f => f.id === finding.id)}
                                            >
                                                {reportCart.find(f => f.id === finding.id) ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add to Report
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {finding.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredFindings.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No findings found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Column: Report Builder (Cart) */}
                <div className="w-96 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col shadow-inner">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Report Builder
                            </h2>
                            <Badge variant="secondary">{reportCart.length} items</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Selected findings for export</p>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-3">
                            {reportCart.map((finding) => (
                                <div key={finding.id} className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm group relative">
                                    <button
                                        onClick={() => removeFromCart(finding.id)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <h4 className="font-medium text-sm pr-6">{finding.title}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className={cn("text-[10px] px-1 py-0", getSeverityColor(finding.severity))}>
                                            {finding.severity}
                                        </Badge>
                                        <span className="text-xs text-gray-500 font-mono">{finding.id}</span>
                                    </div>
                                </div>
                            ))}
                            {reportCart.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm">Your report is empty.</p>
                                    <p className="text-xs mt-1">Add findings from the library.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg space-y-2">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={exportJSON}
                            disabled={reportCart.length === 0}
                        >
                            <FileJson className="w-4 h-4 mr-2" />
                            Export JSON
                        </Button>
                        <Button
                            className="w-full"
                            onClick={copyMarkdown}
                            disabled={reportCart.length === 0}
                        >
                            {showCopiedToast ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Markdown
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
