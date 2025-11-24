import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Building2, Users, FileText, Activity, Edit, Archive, Download } from 'lucide-react'

interface Client {
    id: string
    name: string
    logoUrl?: string
    status: 'Active' | 'Inactive' | 'Prospect' | 'Archived'
    riskLevel: 'High' | 'Medium' | 'Low'
    industry: string
    companySize: 'Enterprise' | 'SMB' | 'Startup'
    primaryContact: string
    email: string
    phone?: string
    lastActivity: string
    lastActivityDate: Date
    tags: string[]
    projectsCount: number
    reportsCount: number
    totalFindings: number
    findingsBySeverity: {
        critical: number
        high: number
        medium: number
        low: number
    }
    createdAt: Date
    updatedAt: Date
}

interface ClientDetailModalProps {
    client: Client | null
    open: boolean
    onClose: () => void
    onEdit: (client: Client) => void
}

export default function ClientDetailModal({ client, open, onClose, onEdit }: ClientDetailModalProps) {
    if (!client) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            case 'Inactive':
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            case 'Prospect':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    // Mock data for associated projects
    const associatedProjects = [
        { id: '1', name: 'Q4 2024 External Pentest', status: 'In Progress', priority: 'High', progress: 65 },
        { id: '2', name: 'Web Application Security Audit', status: 'Completed', priority: 'Medium', progress: 100 },
        { id: '3', name: 'Infrastructure Review', status: 'Planning', priority: 'Low', progress: 15 },
    ]

    // Mock recent activity
    const recentActivity = [
        { id: '1', action: 'Critical finding identified', date: '2 hours ago', type: 'critical' },
        { id: '2', action: 'Report generated', date: '1 day ago', type: 'success' },
        { id: '3', action: 'New project started', date: '3 days ago', type: 'info' },
    ]

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {client.logoUrl && (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl">
                                    {client.logoUrl}
                                </div>
                            )}
                            <div>
                                <DialogTitle className="text-2xl">{client.name}</DialogTitle>
                                <p className="text-muted-foreground mt-1">{client.primaryContact}</p>
                            </div>
                        </div>
                        <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                    {/* Contact Information */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{client.email}</p>
                                </div>
                            </div>
                            {client.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{client.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Industry</p>
                                    <p className="font-medium">{client.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Company Size</p>
                                    <p className="font-medium">{client.companySize}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Projects</p>
                                    <p className="text-2xl font-bold mt-1">{client.projectsCount || 0}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Findings</p>
                                    <p className="text-2xl font-bold mt-1">{client.totalFindings || 0}</p>
                                </div>
                                <div className="p-3 bg-amber-500/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-amber-500" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Critical Issues</p>
                                    <p className="text-2xl font-bold mt-1 text-red-500">{client.findingsBySeverity?.critical || 0}</p>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Associated Projects */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Associated Projects</h3>
                        <div className="space-y-3">
                            {associatedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{project.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {project.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {project.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <span>Progress</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'critical'
                                            ? 'bg-red-500'
                                            : activity.type === 'success'
                                                ? 'bg-emerald-500'
                                                : 'bg-blue-500'
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button onClick={() => onEdit(client)} className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
