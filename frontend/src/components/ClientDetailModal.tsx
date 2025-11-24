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



    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {client.logoUrl && (
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                                    {client.logoUrl}
                                </div>
                            )}
                            <div>
                                <DialogTitle className="text-xl">{client.name}</DialogTitle>
                                <p className="text-muted-foreground text-sm mt-0.5">{client.primaryContact}</p>
                            </div>
                        </div>
                        <Badge className={`${getStatusColor(client.status)} mr-8`}>{client.status}</Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Contact Information */}
                    <div className="bg-card border border-border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{client.email}</p>
                                </div>
                            </div>
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="text-sm font-medium">{client.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Industry</p>
                                    <p className="text-sm font-medium">{client.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Company Size</p>
                                    <p className="text-sm font-medium">{client.companySize}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-card border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Projects</p>
                                    <p className="text-xl font-bold mt-0.5">{client.projectsCount || 0}</p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Findings</p>
                                    <p className="text-xl font-bold mt-0.5">{client.totalFindings || 0}</p>
                                </div>
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Activity className="w-5 h-5 text-amber-500" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Critical Issues</p>
                                    <p className="text-xl font-bold mt-0.5 text-red-500">{client.findingsBySeverity?.critical || 0}</p>
                                </div>
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Activity className="w-5 h-5 text-red-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Associated Projects */}
                    <div className="bg-card border border-border rounded-lg p-3">
                        <h3 className="text-sm font-semibold mb-3">Associated Projects</h3>
                        <div className="space-y-2">
                            {associatedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{project.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                {project.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                {project.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24">
                                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                                                <span>Progress</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <Button onClick={() => onEdit(client)} className="flex-1" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                        </Button>
                        <Button variant="outline" className="flex-1" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                        <Button variant="outline" className="flex-1" size="sm">
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
