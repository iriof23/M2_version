import { useState, useEffect } from 'react'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BillingSettings() {
    const [paddle, setPaddle] = useState<Paddle | null>(null)
    const [loading, setLoading] = useState<string | null>(null)

    // Mock current plan data (replace with actual API call)
    const currentPlan = 'FREE'
    const currentCredits = 10

    // Initialize Paddle
    useEffect(() => {
        const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN
        if (token) {
            initializePaddle({
                token,
                eventCallback: (data) => {
                    console.log('Paddle Event:', data)
                }
            }).then((paddleInstance) => {
                if (paddleInstance) {
                    setPaddle(paddleInstance)
                }
            })
        } else {
            console.warn('VITE_PADDLE_CLIENT_TOKEN not found in environment variables')
        }
    }, [])

    // Open Paddle Checkout
    const openCheckout = (priceId: string) => {
        if (!paddle) {
            console.error('Paddle not initialized')
            return
        }
        
        setLoading(priceId)
        paddle.Checkout.open({
            items: [{ priceId, quantity: 1 }]
        })
        // Reset loading state after a delay (Paddle handles the modal)
        setTimeout(() => setLoading(null), 1000)
    }

    const plans = [
        {
            id: 'free',
            name: 'Free',
            subtitle: 'Hobbyist',
            price: 0,
            priceId: null,
            credits: 10,
            features: [
                '1 Active Project',
                'PDF Export',
                '10 AI Credits/month',
                'Community Support'
            ],
            current: currentPlan === 'FREE'
        },
        {
            id: 'pro',
            name: 'Pro',
            subtitle: 'Freelancer',
            price: 49,
            priceId: 'pri_pro_placeholder',
            credits: 500,
            features: [
                'Unlimited Projects',
                'PDF & DOCX Export',
                '500 AI Credits/month',
                'Priority Support',
                'Custom Branding'
            ],
            current: currentPlan === 'PRO',
            popular: false
        },
        {
            id: 'agency',
            name: 'Agency',
            subtitle: 'Security Teams',
            price: 149,
            priceId: 'pri_agency_placeholder',
            credits: 2000,
            features: [
                'Everything in Pro',
                'White-label Reports',
                'Client Portal Access',
                '2000 AI Credits/month',
                'Dedicated Support',
                'SSO & SAML'
            ],
            current: currentPlan === 'AGENCY',
            popular: true
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Subscription & Credits</h2>
                <p className="text-zinc-400 mt-1">Manage your plan and AI credits</p>
            </div>

            {/* Current Status Bar */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-sm text-zinc-400">Current Plan</p>
                                <p className="text-xl font-bold text-white">{currentPlan}</p>
                            </div>
                            <div className="h-12 w-px bg-zinc-800" />
                            <div>
                                <p className="text-sm text-zinc-400">AI Credits</p>
                                <p className="text-xl font-bold text-white flex items-center gap-2">
                                    {currentCredits} <Zap className="w-5 h-5 text-yellow-500" />
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                            View Usage
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={cn(
                            'bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col hover:border-zinc-700 transition-colors relative',
                            plan.popular && 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-emerald-600 text-white border-0 px-3 py-1">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Recommended
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="pb-4">
                            <div className="space-y-2">
                                <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                                <p className="text-sm text-zinc-400">{plan.subtitle}</p>
                                <div className="flex items-baseline gap-1 mt-4">
                                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                                    <span className="text-zinc-400">/month</span>
                                </div>
                                {plan.credits > 0 && (
                                    <p className="text-sm text-emerald-400 flex items-center gap-1">
                                        <Zap className="w-4 h-4" />
                                        {plan.credits} AI Credits
                                    </p>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col gap-4">
                            {/* Features List */}
                            <ul className="space-y-3 flex-1">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-zinc-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            {plan.current ? (
                                <Button
                                    disabled
                                    className="w-full bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                >
                                    Current Plan
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => plan.priceId && openCheckout(plan.priceId)}
                                    disabled={loading === plan.priceId || !paddle}
                                    className={cn(
                                        'w-full py-2 rounded-md font-medium transition-colors',
                                        plan.popular
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    )}
                                >
                                    {loading === plan.priceId ? 'Loading...' : 'Upgrade'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Additional Info */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Need more credits?</h3>
                            <p className="text-sm text-zinc-400 mt-1">
                                AI credits are used for report generation, vulnerability enrichment, and automated analysis. 
                                Credits reset monthly with your subscription.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

