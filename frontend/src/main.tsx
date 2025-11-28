import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  // Fallback or error - throwing error stops app which is good for required config
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            appearance={{
                baseTheme: dark,
                variables: { colorPrimary: '#10b981', colorBackground: '#09090b' }
            }}
        >
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ClerkProvider>
    </React.StrictMode>,
)
