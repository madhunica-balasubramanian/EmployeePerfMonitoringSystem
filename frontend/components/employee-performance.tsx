"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

// Mock data - in a real app, this would come from an API
const getInitialPerformanceData = (employeeId: string) => {
  return {
    productivity: 75,
    qualityScore: 82,
    deadlinesMet: 90,
    projectsCompleted: 8,
    goalsAchieved: 7,
    totalGoals: 10,
    skillsRating: 4,
  }
}

export function EmployeePerformance({ employeeId }: { employeeId: string }) {
  const [performanceData, setPerformanceData] = useState(getInitialPerformanceData(employeeId))
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(performanceData)

  // Calculate derived metrics
  const goalCompletionRate = Math.round((performanceData.goalsAchieved / performanceData.totalGoals) * 100)
  const overallPerformance = Math.round(
    (performanceData.productivity + performanceData.qualityScore + performanceData.deadlinesMet) / 3,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: Number.parseInt(value, 10) || 0,
    })
  }

  const handleSave = () => {
    setPerformanceData(formData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Overall Performance</h3>
          <span className="text-sm font-medium">{overallPerformance}%</span>
        </div>
        <Progress value={overallPerformance} className="h-2" />
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productivity">Productivity</Label>
              <Input
                id="productivity"
                name="productivity"
                type="number"
                min="0"
                max="100"
                value={formData.productivity}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualityScore">Quality Score</Label>
              <Input
                id="qualityScore"
                name="qualityScore"
                type="number"
                min="0"
                max="100"
                value={formData.qualityScore}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlinesMet">Deadlines Met (%)</Label>
              <Input
                id="deadlinesMet"
                name="deadlinesMet"
                type="number"
                min="0"
                max="100"
                value={formData.deadlinesMet}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectsCompleted">Projects Completed</Label>
              <Input
                id="projectsCompleted"
                name="projectsCompleted"
                type="number"
                min="0"
                value={formData.projectsCompleted}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalsAchieved">Goals Achieved</Label>
              <Input
                id="goalsAchieved"
                name="goalsAchieved"
                type="number"
                min="0"
                value={formData.goalsAchieved}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalGoals">Total Goals</Label>
              <Input
                id="totalGoals"
                name="totalGoals"
                type="number"
                min="1"
                value={formData.totalGoals}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Productivity</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{performanceData.productivity}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Quality Score</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{performanceData.qualityScore}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Deadlines Met</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{performanceData.deadlinesMet}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Projects Completed</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{performanceData.projectsCompleted}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Goal Completion</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{goalCompletionRate}%</div>
                <div className="text-sm text-muted-foreground">
                  ({performanceData.goalsAchieved}/{performanceData.totalGoals})
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Skills Rating</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{performanceData.skillsRating}/5</div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Performance Data</Button>
        </>
      )}
    </div>
  )
}
