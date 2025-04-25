"use client"

import { BarChart3, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for team metrics
const teamPerformanceData = {
  averageProductivity: 78,
  averageQualityScore: 84,
  averageDeadlinesMet: 88,
  totalProjectsCompleted: 42,
  goalCompletionRate: 76,
  skillsImprovement: 12,
}

const teamWellnessData = {
  averageWorkLifeBalance: 70,
  averageStressLevel: 35,
  averageJobSatisfaction: 78,
  averageTeamEngagement: 82,
  totalAbsenceDays: 18,
  wellnessParticipationRate: 65,
}

export function TeamMetrics() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="wellness">Team Wellness</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Team Performance Metrics</CardTitle>
                <CardDescription>Aggregate performance data for your department</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-sm font-medium">Average Productivity</div>
                  <div className="mt-1 text-2xl font-bold">{teamPerformanceData.averageProductivity}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Quality Score</div>
                  <div className="mt-1 text-2xl font-bold">{teamPerformanceData.averageQualityScore}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Deadlines Met</div>
                  <div className="mt-1 text-2xl font-bold">{teamPerformanceData.averageDeadlinesMet}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Total Projects Completed</div>
                  <div className="mt-1 text-2xl font-bold">{teamPerformanceData.totalProjectsCompleted}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Goal Completion Rate</div>
                  <div className="mt-1 text-2xl font-bold">{teamPerformanceData.goalCompletionRate}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Skills Improvement</div>
                  <div className="mt-1 text-2xl font-bold">+{teamPerformanceData.skillsImprovement}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wellness">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Team Wellness Metrics</CardTitle>
                <CardDescription>Aggregate wellness data for your department</CardDescription>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-sm font-medium">Average Work-Life Balance</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.averageWorkLifeBalance}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Stress Level</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.averageStressLevel}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Job Satisfaction</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.averageJobSatisfaction}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Average Team Engagement</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.averageTeamEngagement}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Total Absence Days</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.totalAbsenceDays}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Wellness Participation Rate</div>
                  <div className="mt-1 text-2xl font-bold">{teamWellnessData.wellnessParticipationRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
