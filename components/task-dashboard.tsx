"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import { LogOut } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  deadline: string
  completed: boolean
  createdAt: string
}

interface TaskDashboardProps {
  user: { email: string } | null
  onLogout: () => void
}

export function TaskDashboard({ user, onLogout }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [sortBy, setSortBy] = useState<"deadline" | "priority" | "created">("deadline")

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Add new task
  const handleAddTask = (taskData: Omit<Task, "id" | "completed" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks([newTask, ...tasks])
    setShowForm(false)
  }

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Filter tasks
  let filteredTasks = tasks
  if (filter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed)
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed)
  }

  // Sort tasks
  filteredTasks.sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    } else if (sortBy === "priority") {
      const priorityMap = { high: 0, medium: 1, low: 2 }
      return priorityMap[a.priority] - priorityMap[b.priority]
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">TaskFlow</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Completed</div>
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Pending</div>
            <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
          </div>
        </div>

        {/* Add Task Button and Controls */}
        <div className="flex flex-col gap-4 mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Add New Task"}
          </Button>

          {showForm && <TaskForm onAddTask={handleAddTask} />}

          {/* Filter and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              {(["all", "pending", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="created">Sort by Created</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {tasks.length === 0 ? "No tasks yet. Create one to get started!" : "No tasks match your filters."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
