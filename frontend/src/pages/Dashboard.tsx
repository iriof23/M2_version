import {
    AlertTriangle,
    Calendar,
    ChevronRight,
    DollarSign,
    FileText,
    Plus,
    Target,
    TrendingUp
} from 'lucide-react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock Data
const stats = [
    {
        label: 'Active Engagements',
        value: '3',
        change: '+1 this month',
        trend: 'up',
        icon: Target,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        label: 'Reports Due',
        value: '2',
        change: 'Next 7 days',
        trend: 'neutral',
        icon: Calendar,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10'
    },
    {
        label: 'Critical Findings',
        value: '11',
        change: '+4 new',
        trend: 'down',
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10'
    },
    {
        label: 'Pipeline Value',
        value: '$42.5k',
        change: '+12% vs last mo',
        trend: 'up',
        icon: DollarSign,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10'
    }
]

const activeProjects = [
    {
        id: 1,
        name: 'Q4 External Pentest',
        client: 'Global Finance Ltd',
        stage: 'Testing',
        progress: 65,
        dueDate: 'Oct 24',
        avatar: 'GF'
    },
    {
        id: 2,
        name: 'Web App Security Audit',
        client: 'TechStart Inc',
        stage: 'Reporting',
        progress: 90,
        dueDate: 'Oct 15',
        avatar: 'TS'
    },
    {
        id: 3,
        name: 'Cloud Infrastructure Review',
        client: 'Acme Corp',
        stage: 'Scoping',
        progress: 15,
        dueDate: 'Nov 01',
        avatar: 'AC'
    }
]

const recentActivity = [
    {
        id: 1,
        user: 'Sarah Connor',
        action: 'identified a critical vulnerability',
        target: 'SQL Injection',
        project: 'Global Finance Ltd',
        time: '2 hours ago',
        avatar: 'SC'
    },
    {
        id: 2,
        user: 'John Smith',
        action: 'generated a report',
        target: 'Draft v1',
        project: 'TechStart Inc',
        time: '4 hours ago',
        avatar: 'JS'
    },
    {
        id: 3,
        user: 'Mike Ross',
        action: 'started a new project',
        target: 'Cloud Review',
        project: 'Acme Corp',
        time: '1 day ago',
        avatar: 'MR'
    }
]

const vulnerabilityData = [
    { name: 'Mon', findings: 4 },
    { name: 'Tue', findings: 7 },
    { name: 'Wed', findings: 5 },
    { name: 'Thu', findings: 12 },
    { name: 'Fri', findings: 8 },
    { name: 'Sat', findings: 3 },
    { name: 'Sun', findings: 6 },
]

const severityData = [
    { name: 'Critical', value: 11, color: '#EF4444' }, // red-500
    { name: 'High', value: 24, color: '#F97316' },     // orange-500
    { name: 'Medium', value: 18, color: '#EAB308' },   // yellow-500
    { name: 'Low', value: 12, color: '#22C55E' },      // green-500
]

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Overview of your security engagements and business health
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Generate Report
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-sm font-medium",
                                    stat.trend === 'up' ? "text-emerald-600" :
                                        stat.trend === 'down' ? "text-red-600" : "text-gray-500"
                                )}>
                                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Projects */}
                    <Card className="border-none shadow-md bg-white dark:bg-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Active Projects</CardTitle>
                                <CardDescription>Current engagements and their status</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {activeProjects.map((project) => (
                                    <div key={project.id} className="group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 bg-primary/10 text-primary font-bold">
                                                    <AvatarFallback>{project.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {project.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{project.client}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className={cn(
                                                    "mb-1",
                                                    project.stage === 'Reporting' ? "border-orange-500 text-orange-500" :
                                                        project.stage === 'Testing' ? "border-blue-500 text-blue-500" :
                                                            "border-gray-500 text-gray-500"
                                                )}>
                                                    {project.stage}
                                                </Badge>
                                                <p className="text-xs text-gray-500">Due {project.dueDate}</p>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vulnerability Trend Chart */}
                    <Card className="border-none shadow-md bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>Vulnerability Trend</CardTitle>
                            <CardDescription>Findings identified over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={vulnerabilityData}>
                                    <defs>
                                        <linearGradient id="colorFindings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="findings"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorFindings)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="space-y-8">
                    {/* Severity Distribution */}
                    <Card className="border-none shadow-md bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>Severity Distribution</CardTitle>
                            <CardDescription>Current open findings by risk</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {severityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">65</span>
                                <span className="text-xs text-gray-500">Total</span>
                            </div>
                        </CardContent>
                        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                            {severityData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                                    <span className="text-sm font-bold ml-auto text-gray-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-none shadow-md bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest team actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActivity.map((activity, i) => (
                                    <div key={activity.id} className="flex gap-4 relative">
                                        {/* Connector Line */}
                                        {i !== recentActivity.length - 1 && (
                                            <div className="absolute left-[18px] top-10 bottom-[-24px] w-[2px] bg-gray-100 dark:bg-gray-700" />
                                        )}

                                        <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 z-10">
                                            <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-xs">
                                                {activity.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                                                <span className="font-medium text-primary">{activity.target}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                                                    {activity.project}
                                                </Badge>
                                                <span className="text-xs text-gray-500">{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
