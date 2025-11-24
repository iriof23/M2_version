import { useState, useRef, useEffect } from 'react'
import { Plus, Search, FileText, Image, Globe, Trash2, Upload, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { vulnerabilityDatabase, type Vulnerability } from '@/data/vulnerabilities'
import RichTextEditor from '@/components/RichTextEditor'
import { useParams } from 'react-router-dom'

interface ProjectFinding {
    id: string
    owaspId: string
    title: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'
    cvssScore?: number
    cvssVector?: string
    status: 'Open' | 'In Progress' | 'Fixed' | 'Accepted Risk'
    description: string
    recommendations: string
    affectedAssets: Array<{ url: string; description: string; instanceCount: number }>
    screenshots: Array<{ id: string; url: string; caption: string }>
}

interface FindingsTabContentProps {
    projectId: string
    onUpdate: () => void
}

export default function FindingsTabContent({ onUpdate }: Omit<FindingsTabContentProps, 'projectId'>) {
    const { projectId } = useParams()
    const [findings, setFindings] = useState<ProjectFinding[]>([])
    const [selectedFinding, setSelectedFinding] = useState<ProjectFinding | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeEditorTab, setActiveEditorTab] = useState<'details' | 'assets' | 'screenshots'>('details')
    const [newAssetUrl, setNewAssetUrl] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [selectedVulns, setSelectedVulns] = useState<Vulnerability[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load findings from localStorage on mount
    useEffect(() => {
        if (projectId) {
            const storageKey = `findings_${projectId}`
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                try {
                    const loadedFindings = JSON.parse(stored)
                    setFindings(loadedFindings)
                } catch (e) {
                    console.error('Failed to load findings:', e)
                }
            }
        }
    }, [projectId])

    // Save findings to localStorage whenever they change
    useEffect(() => {
        if (projectId && findings.length > 0) {
            const storageKey = `findings_${projectId}`
            localStorage.setItem(storageKey, JSON.stringify(findings))
        }
    }, [findings, projectId])

    // Add finding from library
    const handleAddFinding = (vuln: Vulnerability) => {
        const newFinding: ProjectFinding = {
            id: `finding-${Date.now()}`,
            owaspId: vuln.id,
            title: vuln.title,
            severity: vuln.severity === 'Info' ? 'Informational' : vuln.severity,
            cvssVector: vuln.cvss_vector,
            status: 'Open',
            description: vuln.description,
            recommendations: vuln.recommendation,
            affectedAssets: [],
            screenshots: []
        }
        const updatedFindings = [...findings, newFinding]
        setFindings(updatedFindings)
        setSelectedFinding(newFinding)
        setShowAddModal(false)
        onUpdate()
    }

    // Bulk add findings from library
    const handleBulkAddFindings = () => {
        const newFindings: ProjectFinding[] = selectedVulns.map((vuln, index) => ({
            id: `finding-${Date.now()}-${index}`,
            owaspId: vuln.id,
            title: vuln.title,
            severity: vuln.severity === 'Info' ? 'Informational' : vuln.severity,
            cvssVector: vuln.cvss_vector,
            status: 'Open',
            description: vuln.description,
            recommendations: vuln.recommendation,
            affectedAssets: [],
            screenshots: []
        }))

        const updatedFindings = [...findings, ...newFindings]
        setFindings(updatedFindings)

        // Select the first newly added finding
        if (newFindings.length > 0) {
            setSelectedFinding(newFindings[0])
        }

        // Reset modal state
        setShowAddModal(false)
        setSelectedVulns([])
        setSearchQuery('')

        // Show success notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-medium'
        notification.textContent = `✓ Added ${newFindings.length} finding${newFindings.length !== 1 ? 's' : ''} successfully!`
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.style.opacity = '0'
            notification.style.transition = 'opacity 300ms'
            setTimeout(() => notification.remove(), 300)
        }, 3000)

        onUpdate()
    }

    // Update finding
    const handleUpdateFinding = (updated: ProjectFinding) => {
        const updatedFindings = findings.map(f => f.id === updated.id ? updated : f)
        setFindings(updatedFindings)
        setSelectedFinding(updated)
        onUpdate()
    }

    // Save changes
    const handleSaveChanges = () => {
        // Persist to localStorage (already done via useEffect)
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium flex items-center gap-2'
        notification.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Changes saved successfully</span>'
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.style.opacity = '0'
            notification.style.transition = 'opacity 300ms'
            setTimeout(() => notification.remove(), 300)
        }, 3000)

        onUpdate()
    }

    // Delete finding
    const handleDeleteFinding = () => {
        if (!selectedFinding) return

        const updatedFindings = findings.filter(f => f.id !== selectedFinding.id)
        setFindings(updatedFindings)
        setSelectedFinding(null)
        setShowDeleteDialog(false)

        // Update localStorage
        if (projectId) {
            const storageKey = `findings_${projectId}`
            if (updatedFindings.length > 0) {
                localStorage.setItem(storageKey, JSON.stringify(updatedFindings))
            } else {
                localStorage.removeItem(storageKey)
            }
        }

        onUpdate()
    }

    // Add affected asset
    const handleAddAsset = () => {
        if (!selectedFinding || !newAssetUrl.trim()) return

        handleUpdateFinding({
            ...selectedFinding,
            affectedAssets: [...selectedFinding.affectedAssets, {
                url: newAssetUrl.trim(),
                description: '',
                instanceCount: 1
            }]
        })
        setNewAssetUrl('')
    }

    // Screenshot upload
    const processFile = (file: File) => {
        if (!selectedFinding) return

        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Max 5MB.')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            const newScreenshot = {
                id: `screen-${Date.now()}`,
                url: result,
                caption: ''
            }
            handleUpdateFinding({
                ...selectedFinding,
                screenshots: [...selectedFinding.screenshots, newScreenshot]
            })
        }
        reader.readAsDataURL(file)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const removeScreenshot = (id: string) => {
        if (!selectedFinding) return
        handleUpdateFinding({
            ...selectedFinding,
            screenshots: selectedFinding.screenshots.filter(s => s.id !== id)
        })
    }

    const updateCaption = (id: string, caption: string) => {
        if (!selectedFinding) return
        handleUpdateFinding({
            ...selectedFinding,
            screenshots: selectedFinding.screenshots.map(s =>
                s.id === id ? { ...s, caption } : s
            )
        })
    }

    // Group findings by severity
    const groupedFindings = {
        Critical: findings.filter(f => f.severity === 'Critical'),
        High: findings.filter(f => f.severity === 'High'),
        Medium: findings.filter(f => f.severity === 'Medium'),
        Low: findings.filter(f => f.severity === 'Low'),
        Informational: findings.filter(f => f.severity === 'Informational')
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            case 'High':
                return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
            case 'Medium':
                return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
            case 'Low':
                return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
            default:
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        }
    }

    return (
        <div className="flex gap-4 h-[calc(100vh-300px)]">
            {/* Left Panel - Findings List */}
            <div className="w-1/3 space-y-3">
                <div className="flex items-center gap-2">
                    <Button onClick={() => setShowAddModal(true)} size="sm" className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Finding
                    </Button>
                </div>

                <ScrollArea className="h-full">
                    <div className="space-y-3 pr-2">
                        {findings.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        No Findings Yet
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                        Click "Add Finding" to add vulnerabilities from the library
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {Object.entries(groupedFindings).map(([severity, items]) => (
                                    items.length > 0 && (
                                        <div key={severity}>
                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                                {severity} ({items.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {items.map((finding) => (
                                                    <Card
                                                        key={finding.id}
                                                        className={cn(
                                                            'cursor-pointer transition-all hover:shadow-md relative',
                                                            selectedFinding?.id === finding.id
                                                                ? 'border-2 border-primary shadow-md bg-primary/5'
                                                                : 'hover:border-primary/50'
                                                        )}
                                                        onClick={() => setSelectedFinding(finding)}
                                                    >
                                                        {selectedFinding?.id === finding.id && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                                                        )}
                                                        <CardContent className="p-3">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                                        {finding.title}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <Badge className={cn('text-[10px] px-1.5 py-0', getSeverityColor(finding.severity))}>
                                                                            {finding.severity}
                                                                        </Badge>
                                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                            {finding.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Panel - Finding Editor */}
            <div className="flex-1">
                {selectedFinding ? (
                    <Card className="h-full">
                        <CardContent className="p-4 h-full flex flex-col">
                            {/* Active Finding Header */}
                            <div className="mb-4 pb-3 border-b-2 border-primary/20 bg-primary/5 -m-4 p-4 rounded-t-lg">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Currently Editing</p>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {selectedFinding.title}
                                        </h3>
                                    </div>
                                    <Badge className={cn('text-[10px] px-2 py-1', getSeverityColor(selectedFinding.severity))}>
                                        {selectedFinding.severity}
                                    </Badge>
                                </div>
                            </div>

                            {/* Editor Tabs */}
                            <div className="flex items-center gap-1 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    onClick={() => setActiveEditorTab('details')}
                                    className={cn(
                                        'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                                        activeEditorTab === 'details'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    )}
                                >
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    Finding Details
                                </button>
                                <button
                                    onClick={() => setActiveEditorTab('assets')}
                                    className={cn(
                                        'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                                        activeEditorTab === 'assets'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    )}
                                >
                                    <Globe className="w-4 h-4 inline mr-1" />
                                    Affected Assets
                                </button>
                                <button
                                    onClick={() => setActiveEditorTab('screenshots')}
                                    className={cn(
                                        'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                                        activeEditorTab === 'screenshots'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    )}
                                >
                                    <Image className="w-4 h-4 inline mr-1" />
                                    Screenshots
                                </button>
                            </div>

                            {/* Editor Content */}
                            <ScrollArea className="flex-1">
                                {activeEditorTab === 'details' && (
                                    <div className="space-y-4 pr-2">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Title *
                                            </label>
                                            <Input
                                                value={selectedFinding.title}
                                                onChange={(e) => handleUpdateFinding({ ...selectedFinding, title: e.target.value })}
                                                className="text-sm"
                                            />
                                        </div>

                                        {/* Severity */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Severity *
                                            </label>
                                            <div className="flex gap-2">
                                                {(['Critical', 'High', 'Medium', 'Low', 'Informational'] as const).map((sev) => (
                                                    <button
                                                        key={sev}
                                                        onClick={() => handleUpdateFinding({ ...selectedFinding, severity: sev })}
                                                        className={cn(
                                                            'px-3 py-1.5 text-xs font-medium rounded transition-all border',
                                                            selectedFinding.severity === sev
                                                                ? getSeverityColor(sev)
                                                                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                                                        )}
                                                    >
                                                        {sev}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={selectedFinding.status}
                                                onChange={(e) => handleUpdateFinding({ ...selectedFinding, status: e.target.value as any })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Fixed">Fixed</option>
                                                <option value="Accepted Risk">Accepted Risk</option>
                                            </select>
                                        </div>

                                        {/* CVSS Vector */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                CVSS Vector
                                            </label>
                                            <Input
                                                value={selectedFinding.cvssVector || ''}
                                                onChange={(e) => handleUpdateFinding({ ...selectedFinding, cvssVector: e.target.value })}
                                                className="text-xs font-mono"
                                                placeholder="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description *
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                Describe how you found this vulnerability, exploitation steps, and impact.
                                            </p>
                                            <RichTextEditor
                                                content={selectedFinding.description}
                                                onChange={(content) => handleUpdateFinding({ ...selectedFinding, description: content })}
                                                placeholder="Describe the vulnerability, how you found it, and the exploitation steps..."
                                            />
                                        </div>

                                        {/* Recommendations */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Recommendations *
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                Provide specific remediation steps for this application.
                                            </p>
                                            <RichTextEditor
                                                content={selectedFinding.recommendations}
                                                onChange={(content) => handleUpdateFinding({ ...selectedFinding, recommendations: content })}
                                                placeholder="Provide specific remediation steps..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeEditorTab === 'assets' && (
                                    <div className="space-y-4 pr-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                Affected Assets
                                            </h3>
                                            <div className="flex gap-2 mb-4">
                                                <Input
                                                    value={newAssetUrl}
                                                    onChange={(e) => setNewAssetUrl(e.target.value)}
                                                    placeholder="Add domain, IP range, or URL (e.g., 192.168.1.0/24)"
                                                    className="flex-1"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddAsset()}
                                                />
                                                <Button
                                                    onClick={handleAddAsset}
                                                    disabled={!newAssetUrl.trim()}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>

                                        {selectedFinding.affectedAssets.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
                                                No scope items added yet
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedFinding.affectedAssets.map((asset, index) => (
                                                    <Card key={index}>
                                                        <CardContent className="p-3">
                                                            <div className="flex items-start gap-2">
                                                                <Globe className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                                <div className="flex-1 space-y-2">
                                                                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                                                                        {asset.url}
                                                                    </p>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                                Description
                                                                            </label>
                                                                            <Input
                                                                                value={asset.description}
                                                                                onChange={(e) => {
                                                                                    const updated = [...selectedFinding.affectedAssets]
                                                                                    updated[index].description = e.target.value
                                                                                    handleUpdateFinding({ ...selectedFinding, affectedAssets: updated })
                                                                                }}
                                                                                placeholder="Optional"
                                                                                className="text-xs h-8"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                                Instances
                                                                            </label>
                                                                            <Input
                                                                                type="number"
                                                                                min="1"
                                                                                value={asset.instanceCount}
                                                                                onChange={(e) => {
                                                                                    const updated = [...selectedFinding.affectedAssets]
                                                                                    updated[index].instanceCount = parseInt(e.target.value) || 1
                                                                                    handleUpdateFinding({ ...selectedFinding, affectedAssets: updated })
                                                                                }}
                                                                                className="text-xs h-8"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        handleUpdateFinding({
                                                                            ...selectedFinding,
                                                                            affectedAssets: selectedFinding.affectedAssets.filter((_, i) => i !== index)
                                                                        })
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeEditorTab === 'screenshots' && (
                                    <div className="space-y-4 pr-2">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Screenshots & Evidence
                                                </h3>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Upload Screenshot
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/png, image/jpeg, image/gif"
                                                    onChange={handleFileSelect}
                                                />
                                            </div>

                                            {/* Upload Area */}
                                            {selectedFinding.screenshots.length === 0 && (
                                                <div
                                                    className={cn(
                                                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                                                        isDragging
                                                            ? "border-primary bg-primary/5"
                                                            : "border-gray-300 dark:border-gray-700 hover:border-primary/50"
                                                    )}
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                            <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Click to upload or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            PNG, JPG, GIF up to 5MB
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Screenshots Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedFinding.screenshots.map((screenshot) => (
                                                    <Card key={screenshot.id} className="overflow-hidden group">
                                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                                                            <img
                                                                src={screenshot.url}
                                                                alt="Evidence"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            <button
                                                                onClick={() => removeScreenshot(screenshot.id)}
                                                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <CardContent className="p-3">
                                                            <Input
                                                                value={screenshot.caption}
                                                                onChange={(e) => updateCaption(screenshot.id, e.target.value)}
                                                                placeholder="Add a caption..."
                                                                className="text-xs"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Action Buttons - Only Delete, Save is at top */}
                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Finding
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="h-full">
                        <CardContent className="p-8 text-center flex items-center justify-center h-full">
                            <div>
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    Select a Finding
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Choose a finding from the list to view and edit details
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Add Finding Modal - Bulk Selector */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Add Findings from Library</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                        {/* Left Panel - Available Vulnerabilities */}
                        <div className="space-y-3 flex flex-col min-h-0">
                            <div className="flex-shrink-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Available Vulnerabilities
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search vulnerabilities..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="space-y-2 pr-2">
                                    {vulnerabilityDatabase
                                        .filter(v =>
                                            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            v.description.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((vuln) => {
                                            const isSelected = selectedVulns.some(sv => sv.id === vuln.id)
                                            return (
                                                <Card
                                                    key={vuln.id}
                                                    className={cn(
                                                        "cursor-pointer transition-all",
                                                        isSelected
                                                            ? "opacity-50 border-gray-300"
                                                            : "hover:shadow-md hover:border-primary/50"
                                                    )}
                                                    onClick={() => !isSelected && setSelectedVulns([...selectedVulns, vuln])}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                        {vuln.title}
                                                                    </h4>
                                                                    <Badge className={cn('text-[10px] px-1.5 py-0 flex-shrink-0', getSeverityColor(vuln.severity))}>
                                                                        {vuln.severity}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                                                    {vuln.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="outline" className="text-[10px]">
                                                                        {vuln.category}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            {isSelected ? (
                                                                <span className="text-xs text-gray-400 flex-shrink-0">Added</span>
                                                            ) : (
                                                                <Plus className="w-5 h-5 text-primary flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Right Panel - To Be Added */}
                        <div className="space-y-3 flex flex-col border-l border-gray-200 dark:border-gray-700 pl-4 min-h-0">
                            <div className="flex items-center justify-between flex-shrink-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    To Be Added ({selectedVulns.length})
                                </h3>
                                {selectedVulns.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedVulns([])}
                                        className="text-xs h-7"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>

                            {selectedVulns.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center min-h-0">
                                    <div className="text-center text-gray-400">
                                        <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No findings selected</p>
                                        <p className="text-xs mt-1">Click on vulnerabilities to add them</p>
                                    </div>
                                </div>
                            ) : (
                                <ScrollArea className="flex-1 min-h-0">
                                    <div className="space-y-2 pr-2">
                                        {selectedVulns.map((vuln) => (
                                            <Card key={vuln.id} className="border-primary/30 bg-primary/5">
                                                <CardContent className="p-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                    {vuln.title}
                                                                </h4>
                                                                <Badge className={cn('text-[10px] px-1.5 py-0 flex-shrink-0', getSeverityColor(vuln.severity))}>
                                                                    {vuln.severity}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                                                {vuln.category}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedVulns(selectedVulns.filter(v => v.id !== vuln.id))}
                                                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex-shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddModal(false)
                                setSelectedVulns([])
                                setSearchQuery('')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkAddFindings}
                            disabled={selectedVulns.length === 0}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add {selectedVulns.length} Finding{selectedVulns.length !== 1 ? 's' : ''}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Finding</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to delete this finding? This action cannot be undone.
                        </p>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                                {selectedFinding?.title}
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                Severity: {selectedFinding?.severity}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteFinding}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Finding
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

