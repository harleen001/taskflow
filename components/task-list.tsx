"use client"

import { Trash2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  deadline: string
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10"
      case "low":
        return "text-green-400 bg-green-500/10"
      default:
        return "text-gray-400"
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOverdue = (deadline: string, completed: boolean) => {
    return new Date(deadline) < new Date() && !completed
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-card border border-border rounded-lg p-4 transition ${
            task.completed ? "opacity-60" : ""
          } ${isOverdue(task.deadline, task.completed) ? "border-red-500/30 bg-red-500/5" : ""}`}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <button
              onClick={() => onToggleTask(task.id)}
              className="mt-1 text-primary hover:text-primary-dark transition flex-shrink-0"
            >
              {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg transition ${
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 transition ${
                    task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  {task.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span
                  className={`text-xs ${
                    isOverdue(task.deadline, task.completed) ? "text-red-400 font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {isOverdue(task.deadline, task.completed) ? "OVERDUE: " : ""}
                  {formatDeadline(task.deadline)}
                </span>
              </div>
            </div>

            {/* Delete Button */}
            <Button
              onClick={() => onDeleteTask(task.id)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-400 flex-shrink-0"
            >
              <Trash2 size={20} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
