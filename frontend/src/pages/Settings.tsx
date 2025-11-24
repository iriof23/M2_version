import { useThemeStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Settings() {
    const { theme, setTheme } = useThemeStore()

    const themeOptions = [
        {
            value: 'light' as const,
            label: 'Light',
            icon: Sun,
            description: 'Light mode'
        },
        {
            value: 'dark' as const,
            label: 'Dark',
            icon: Moon,
            description: 'Dark mode'
        },
        {
            value: 'system' as const,
            label: 'System',
            icon: Monitor,
            description: 'Use system preference'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Configure your application preferences
                </p>
            </div>

            {/* Appearance Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the application looks on your device
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-base font-semibold">Theme</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                            Select your preferred theme or use system preference
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {themeOptions.map((option) => {
                                const Icon = option.icon
                                const isSelected = theme === option.value

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className={cn(
                                            'relative flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all hover:bg-accent/50',
                                            isSelected
                                                ? 'border-primary bg-accent shadow-md'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        )}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                                        )}
                                        <Icon className={cn(
                                            'h-8 w-8',
                                            isSelected ? 'text-primary' : 'text-muted-foreground'
                                        )} />
                                        <div className="text-center">
                                            <div className={cn(
                                                'font-semibold',
                                                isSelected ? 'text-foreground' : 'text-muted-foreground'
                                            )}>
                                                {option.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {option.description}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Section (Placeholder) */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Manage your account information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Profile settings coming soon...
                    </p>
                </CardContent>
            </Card>

            {/* Notifications Section (Placeholder) */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Configure how you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Notification settings coming soon...
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
