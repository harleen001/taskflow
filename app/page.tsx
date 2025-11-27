"use client"

import { useState, useEffect } from "react"
import { AuthPage } from "@/components/auth-page"
import { TaskDashboard } from "@/components/task-dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string) => {
    setUser({ email })
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify({ email }))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? <AuthPage onLogin={handleLogin} /> : <TaskDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}
