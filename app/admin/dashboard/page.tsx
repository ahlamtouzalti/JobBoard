"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateJobForm } from "@/components/create-job-form"
import { ApplicationsList } from "@/components/applications-list"
import { JobsList } from "@/components/jobs-list"
import { signOut } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/app/actions/auth"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("jobs")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function verifyAuth() {
      try {
        await checkAuth()
        setIsLoading(false)
      } catch (error) {
        router.push("/admin/login")
      }
    }

    verifyAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Loading dashboard...</h1>
      </div>
    )
  }

  return (
    <div className="py-10 flex flex-col items-center">
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
        <div className="flex gap-4">
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              Logout
            </Button>
          </form>
        </div>
      </div>

      <Tabs defaultValue="jobs" onValueChange={setActiveTab} className="space-y-6 w-full">
        <TabsList className="grid w-full grid-cols-3 bg-green-50">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Manage Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Applications
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Create New Job
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-700">Job Listings</CardTitle>
              <CardDescription>Manage your current job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <JobsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-700">Applications</CardTitle>
              <CardDescription>Review applications from candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="text-green-700">Create New Job Listing</CardTitle>
              <CardDescription>Add a new job offer to your site</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateJobForm onSuccess={() => setActiveTab("jobs")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
