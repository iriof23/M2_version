import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard, statCardColors } from '@/components/StatCard'
import {
    Users,
    FolderKanban,
    FileText,
    AlertTriangle,
    Activity,
    CheckCircle2,
    Clock
} from 'lucide-react'

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalClients: 0,
        totalProjects: 0,
        activeProjects: 0,
        totalReports: 0,
        totalFindings: 0,
        criticalFindings: 0
    })

    useEffect(() => {
        // Load stats from localStorage
        const projects = JSON.parse(localStorage.getItem('projects') || '[]')

        let totalFindings = 0
        let criticalFindings = 0

        projects.forEach((project: any) => {
            const findingsKey = `findings_${project.id}`
            const stored = localStorage.getItem(findingsKey)
            if (stored) {
                try {
                    const findings = JSON.parse(stored)
                    totalFindings += findings.length
                    findings.forEach((f: any) => {
                        if (f.severity.toLowerCase() === 'critical') {
                            criticalFindings++
                        }
                    })
                } catch (e) {
                    // ignore
                }
            }
        })

        setStats({
            totalClients: 5, // Mock data
            totalProjects: projects.length,
            activeProjects: projects.filter((p: any) => p.status === 'In Progress').length,
            totalReports: projects.reduce((sum: number, p: any) => sum + (p.reportsCount || 0), 0),
            totalFindings,
            criticalFindings
        })
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Overview of your penetration testing operations
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Total Clients"
                    value={stats.totalClients}
                    trend="+12%"
                    trendUp={true}
                    {...statCardColors.blue}
                />
                <StatCard
                    icon={<FolderKanban className="w-6 h-6" />}
                    label="Total Projects"
                    value={stats.totalProjects}
                    trend="+15%"
                    trendUp={true}
                    {...statCardColors.blue}
                />
                <StatCard
                    icon={<Activity className="w-6 h-6" />}
                    label="Active Projects"
                    value={stats.activeProjects}
                    trend="+8%"
                    trendUp={true}
                    {...statCardColors.green}
                />
                <StatCard
                    icon={<FileText className="w-6 h-6" />}
                    label="Total Reports"
                    value={stats.totalReports}
                    trend="-5%"
                    trendUp={false}
                    {...statCardColors.yellow}
                />
                <StatCard
                    icon={<AlertTriangle className="w-6 h-6" />}
                    label="Total Findings"
                    value={stats.totalFindings}
                    badge={stats.criticalFindings}
                    badgeLabel="Critical"
                    {...statCardColors.red}
                />
                <StatCard
                    icon={<CheckCircle2 className="w-6 h-6" />}
                    label="Completed Projects"
                    value={stats.totalProjects - stats.activeProjects}
                    trend="+12%"
                    trendUp={true}
                    {...statCardColors.purple}
                />
            </div>

            {/* Recent Activity */}
            <Card className="bg-[#1a1d21] border-gray-800 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400 text-sm">
                        No recent activity to display. Start by creating a project or adding findings.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
