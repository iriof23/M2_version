# ProjectTeamManager Integration Example

## Basic Usage

```tsx
import ProjectTeamManager from '@/components/projects/ProjectTeamManager'

// In your Project Edit Modal or Project Detail View
function ProjectEditModal({ project }: { project: Project }) {
    const [members, setMembers] = useState<ProjectMember[]>([])
    
    // Fetch project members on mount
    useEffect(() => {
        const fetchMembers = async () => {
            // Call your API to get project members
            const response = await api.get(`/projects/${project.id}/members`)
            setMembers(response.data)
        }
        fetchMembers()
    }, [project.id])
    
    return (
        <Dialog>
            <DialogContent>
                {/* Other project fields */}
                
                {/* Team Management Section */}
                <div className="border-t pt-4 mt-4">
                    <ProjectTeamManager
                        projectId={project.id}
                        members={members}
                        onMembersChange={setMembers}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
```

## Integration in ProjectDetailModal

Add to `components/ProjectDetailModal.tsx`:

```tsx
import ProjectTeamManager from '@/components/projects/ProjectTeamManager'

// Inside the modal content, add a new tab or section:
{activeTab === 'team' && (
    <div className="p-6">
        <ProjectTeamManager
            projectId={project.id}
            members={project.members || []}
            onMembersChange={(members) => {
                // Update project state or refresh data
                setProject(prev => ({ ...prev, members }))
            }}
        />
    </div>
)}
```

## API Endpoints Required

The component uses these endpoints:
- `GET /api/projects/available-members` - Get users in organization
- `POST /api/projects/{projectId}/members` - Add member to project
- `DELETE /api/projects/{projectId}/members/{userId}` - Remove member

All endpoints require authentication via Clerk token.

