import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useThemeStore } from './lib/store'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Findings from './pages/Findings'
import ReportBuilder from './pages/ReportBuilder'
import ReportEditor from './pages/ReportEditor'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function App() {
    const initializeTheme = useThemeStore((state) => state.initializeTheme)

    // Initialize theme on mount
    useEffect(() => {
        initializeTheme()
    }, [initializeTheme])

    return (
        <BrowserRouter>
            <Routes>
                {/* Authentication routes */}
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <SignedIn>
                            <Layout />
                        </SignedIn>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="findings" element={<Findings />} />
                    <Route path="reports" element={<ReportBuilder />} />
                    <Route path="reports/:projectId" element={<ReportEditor />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch all & Redirect */}
                <Route 
                    path="*" 
                    element={
                        <>
                            <SignedIn>
                                <Navigate to="/dashboard" />
                            </SignedIn>
                            <SignedOut>
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    } 
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
