import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, AlertTriangle, Clock, Calendar, Target, ChevronRight, Download, Share2, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with actual data from Projects
const mockProjects = [
    {
        id: '1',
        name: 'Q4 2024 External Pentest',
        clientName: 'Acme Corporation',
        clientLogoUrl: '🏢',
        status: 'In Progress' as const,
        progress: 65,
        findingsCount: 23,
        findingsBySeverity: { critical: 3, high: 7, medium: 10, low: 3 },
        teamMembers: [
            { id: '1', name: 'Alice Johnson' },
            { id: '2', name: 'Bob Smith' },
            { id: '3', name: 'Carol White' }
        ],
        leadTester: 'Alice Johnson',
        startDate: new Date('2024-07-14'),
        endDate: new Date('2024-02-27'),
        lastModified: new Date('2024-03-20'),
        scope: 'External network, web applications, API endpoints',
        priority: 'High' as const
    },
    {
        id: '2',
        name: 'Web Application Security Audit',
        clientName: 'TechStart Inc',
        clientLogoUrl: '🚀',
        status: 'In Progress' as const,
        progress: 40,
        findingsCount: 15,
        findingsBySeverity: { critical: 1, high: 4, medium: 7, low: 3 },
        teamMembers: [
            { id: '4', name: 'David Lee' },
            { id: '5', name: 'Emma Davis' }
        ],
        leadTester: 'David Lee',
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-02-14'),
        lastModified: new Date('2024-03-22'),
        scope: 'Customer portal, admin dashboard, payment gateway',
        priority: 'Medium' as const
    },
    {
        id: '3',
        name: 'Mobile App Security Assessment',
        clientName: 'TechStart Inc',
        clientLogoUrl: '🚀',
        status: 'Planning' as const,
        progress: 15,
        findingsCount: 2,
        findingsBySeverity: { critical: 0, high: 1, medium: 1, low: 0 },
        teamMembers: [
            { id: '6', name: 'Frank Miller' }
        ],
        leadTester: 'Frank Miller',
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-02-14'),
        lastModified: new Date('2024-03-18'),
        scope: 'iOS and Android mobile applications',
        priority: 'Low' as const
    },
    {
        id: '4',
        name: 'Cloud Security Review - AWS',
        clientName: 'Acme Corporation',
        clientLogoUrl: '🏢',
        status: 'In Progress' as const,
        progress: 80,
        findingsCount: 18,
        findingsBySeverity: { critical: 2, high: 5, medium: 8, low: 3 },
        teamMembers: [
            { id: '7', name: 'Henry Wilson' },
            { id: '8', name: 'Ivy Taylor' },
            { id: '9', name: 'Jack Brown' }
        ],
        leadTester: 'Henry Wilson',
        startDate: new Date('2024-01-19'),
        endDate: new Date('2024-02-09'),
        lastModified: new Date('2024-03-21'),
        scope: 'AWS infrastructure, IAM policies, S3 buckets',
        priority: 'High' as const
    }
]

export default function ReportBuilder() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProject, setSelectedProject] = useState(mockProjects[0])
    const [statusFilter, setStatusFilter] = useState<'all' | 'In Progress' | 'Planning'>('all')
    const [projectFindingsData, setProjectFindingsData] = useState<Record<string, { count: number, severity: { critical: number, high: number, medium: number, low: number } }>>({})

    // Load actual findings counts from localStorage
    useEffect(() => {
        const data: Record<string, any> = {}
        mockProjects.forEach(project => {
            const storageKey = `findings_${project.id}`
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                try {
                    const findings = JSON.parse(stored)
                    const breakdown = { critical: 0, high: 0, medium: 0, low: 0 }
                    findings.forEach((f: any) => {
                        const s = f.severity.toLowerCase() as keyof typeof breakdown
                        if (breakdown[s] !== undefined) breakdown[s]++
                    })
                    data[project.id] = { count: findings.length, severity: breakdown }
                } catch (e) {
                    data[project.id] = { count: 0, severity: { critical: 0, high: 0, medium: 0, low: 0 } }
                }
            } else {
                data[project.id] = { count: 0, severity: { critical: 0, high: 0, medium: 0, low: 0 } }
            }
        })
        setProjectFindingsData(data)
    }, [])

    // Filter projects
    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleOpenReport = (projectId: string) => {
        navigate(`/reports/${projectId}`)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'Planning':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'Completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-600 dark:text-red-400'
            case 'Medium':
                return 'text-yellow-600 dark:text-yellow-400'
            case 'Low':
                return 'text-green-600 dark:text-green-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Select a project to build your pentest report
                    </p>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left Column - Projects List (40%) */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Search and Filters */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 text-sm"
                            />
                        </div>

                        {/* Status Filter Pills */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-full transition-colors',
                                    statusFilter === 'all'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                All ({mockProjects.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('In Progress')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-full transition-colors',
                                    statusFilter === 'In Progress'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                In Progress ({mockProjects.filter(p => p.status === 'In Progress').length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('Planning')}
                                className={cn(
                                    'px-3 py-1 text-xs rounded-full transition-colors',
                                    statusFilter === 'Planning'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                Planning ({mockProjects.filter(p => p.status === 'Planning').length})
                            </button>
                        </div>
                    </div>

                    {/* Projects List */}
                    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                        {filteredProjects.map((project) => {
                            const findingsData = projectFindingsData[project.id] || { count: 0, severity: { critical: 0, high: 0, medium: 0, low: 0 } }
                            return (
                                <Card
                                    key={project.id}
                                    className={cn(
                                        'cursor-pointer transition-all hover:shadow-md relative',
                                        selectedProject?.id === project.id
                                            ? 'border-2 border-primary shadow-md bg-primary/5'
                                            : 'hover:border-primary/50'
                                    )}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    {selectedProject?.id === project.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                                    )}
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <div className="text-2xl">{project.clientLogoUrl}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {project.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {project.clientName}
                                                </p>

                                                {/* Status and Progress */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={cn('text-[10px] px-1.5 py-0', getStatusColor(project.status))}>
                                                        {project.status}
                                                    </Badge>
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {project.progress}%
                                                    </span>
                                                </div>

                                                {/* Findings Summary */}
                                                <div className="flex gap-1 mt-2">
                                                    {findingsData.severity.critical > 0 && (
                                                        <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                                            {findingsData.severity.critical} C
                                                        </Badge>
                                                    )}
                                                    {findingsData.severity.high > 0 && (
                                                        <Badge className="text-[10px] px-1 py-0 bg-orange-500 hover:bg-orange-600">
                                                            {findingsData.severity.high} H
                                                        </Badge>
                                                    )}
                                                    {findingsData.severity.medium > 0 && (
                                                        <Badge className="text-[10px] px-1 py-0 bg-yellow-500 hover:bg-yellow-600 text-black">
                                                            {findingsData.severity.medium} M
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Right Column - Project Preview (60%) */}
                <div className="lg:col-span-3">
                    {selectedProject ? (
                        <Card>
                            <CardContent className="p-4">
                                {/* Project Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{selectedProject.clientLogoUrl}</div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {selectedProject.name}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedProject.clientName}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(selectedProject.status)}>
                                        {selectedProject.status}
                                    </Badge>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-card border border-border rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Progress</p>
                                                <p className="text-xl font-bold mt-0.5">{selectedProject.progress}%</p>
                                            </div>
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Target className="w-5 h-5 text-blue-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Findings</p>
                                                <p className="text-xl font-bold mt-0.5">
                                                    {projectFindingsData[selectedProject.id]?.count || 0}
                                                </p>
                                            </div>
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <Target className="w-5 h-5 text-amber-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Critical</p>
                                                <p className="text-xl font-bold mt-0.5 text-red-500">
                                                    {projectFindingsData[selectedProject.id]?.severity.critical || 0}
                                                </p>
                                            </div>
                                            <div className="p-2 bg-red-500/10 rounded-lg">
                                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {selectedProject.startDate.toLocaleDateString()} - {selectedProject.endDate.toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Last modified: {selectedProject.lastModified.toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Scope</p>
                                            <p className="text-gray-900 dark:text-white">{selectedProject.scope}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                                        <span className={cn('font-semibold', getPriorityColor(selectedProject.priority))}>
                                            {selectedProject.priority}
                                        </span>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Team</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {selectedProject.teamMembers.map((member) => (
                                                <Avatar key={member.id} className="h-8 w-8 border-2 border-white dark:border-gray-800">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            Lead: {selectedProject.leadTester}
                                        </span>
                                    </div>
                                </div>

                                {/* Findings Breakdown */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Findings by Severity</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="text-center p-2 bg-red-500/10 rounded-lg">
                                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                                {projectFindingsData[selectedProject.id]?.severity?.critical || 0}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Critical</p>
                                        </div>
                                        <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                {projectFindingsData[selectedProject.id]?.severity?.high || 0}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">High</p>
                                        </div>
                                        <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
                                            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                                {projectFindingsData[selectedProject.id]?.severity?.medium || 0}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Medium</p>
                                        </div>
                                        <div className="text-center p-2 bg-green-500/10 rounded-lg">
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {projectFindingsData[selectedProject.id]?.severity?.low || 0}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Low</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-border">
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        onClick={() => handleOpenReport(selectedProject.id)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Open Report
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    No Project Selected
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Select a project from the list to view details
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
