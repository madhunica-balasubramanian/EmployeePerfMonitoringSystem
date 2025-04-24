"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - in a real app, this would come from an API
const getInitialWellnessData = (employeeId: string) => {
  return {
    workLifeBalance: 65,
    stressLevel: 40,
    jobSatisfaction: 75,
    teamEngagement: 80,
    absenceDays: 3,
    wellnessParticipation: "Medium",
  }
}

export function EmployeeWellness({ employeeId }: { employeeId: string }) {
  const [wellnessData, setWellnessData] = useState(getInitialWellnessData(employeeId))
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(wellnessData)

  // Calculate overall wellness score
  const overallWellness = Math.round(
    (wellnessData.workLifeBalance +
      (100 - wellnessData.stressLevel) +
      wellnessData.jobSatisfaction +
      wellnessData.teamEngagement) /
      4,
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: Number.parseInt(value, 10) || 0,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      wellnessParticipation: value,
    })
  }

  const handleSave = () => {
    setWellnessData(formData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Overall Wellness</h3>
          <span className="text-sm font-medium">{overallWellness}%</span>
        </div>
        <Progress value={overallWellness} className="h-2" />
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workLifeBalance">Work-Life Balance</Label>
              <Input
                id="workLifeBalance"
                name="workLifeBalance"
                type="number"
                min="0"
                max="100"
                value={formData.workLifeBalance}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level</Label>
              <Input
                id="stressLevel"
                name="stressLevel"
                type="number"
                min="0"
                max="100"
                value={formData.stressLevel}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobSatisfaction">Job Satisfaction</Label>
              <Input
                id="jobSatisfaction"
                name="jobSatisfaction"
                type="number"
                min="0"
                max="100"
                value={formData.jobSatisfaction}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamEngagement">Team Engagement</Label>
              <Input
                id="teamEngagement"
                name="teamEngagement"
                type="number"
                min="0"
                max="100"
                value={formData.teamEngagement}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="absenceDays">Absence Days (Last 30 Days)</Label>
              <Input
                id="absenceDays"
                name="absenceDays"
                type="number"
                min="0"
                value={formData.absenceDays}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wellnessParticipation">Wellness Program Participation</Label>
              <Select value={formData.wellnessParticipation} onValueChange={handleSelectChange}>
                <SelectTrigger id="wellnessParticipation">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
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
              <div className="text-sm font-medium">Work-Life Balance</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.workLifeBalance}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Stress Level</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.stressLevel}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Job Satisfaction</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.jobSatisfaction}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Team Engagement</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.teamEngagement}%</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Absence Days (Last 30 Days)</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.absenceDays}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Wellness Program Participation</div>
              <div className="mt-1 flex items-center">
                <div className="mr-2 text-2xl font-bold">{wellnessData.wellnessParticipation}</div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Wellness Data</Button>
        </>
      )}
    </div>
  )
}
