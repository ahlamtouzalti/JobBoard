"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, DollarSign, MapPin, Tag } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ApplyForm } from "@/components/apply-form"
import { getJobById } from "@/app/actions/jobs"
import type { Job } from "@/types"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const jobId = Number.parseInt(params.id)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [job, setJob] = useState<(Job & { requirements: string[]; responsibilities: string[] }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      const jobData = await getJobById(jobId)
      setJob(jobData)
      setLoading(false)
    }

    fetchJob()
  }, [jobId])

  if (loading) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Loading job details...</h1>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Job not found</h1>
        <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700">Back to Job Listings</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-10 flex flex-col items-center">
      <Link href="/" className="mb-6 inline-block self-start w-full">
        <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
          ← Back to Listings
        </Button>
      </Link>

      <Card className="mb-8 w-full border-green-100">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-green-700">{job.title}</CardTitle>
              <CardDescription className="text-lg">{job.company}</CardDescription>
            </div>
            <Button onClick={() => setShowApplyForm(!showApplyForm)} className="bg-green-600 hover:bg-green-700">
              {showApplyForm ? "Hide Application Form" : "Apply Now"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-green-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-green-500" />
              <span>{job.category}</span>
            </div>
          </div>

          <Separator className="my-4 bg-green-100" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700">Job Description</h3>
            <p>{job.description}</p>

            <h3 className="text-lg font-semibold pt-4 text-green-700">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1 marker:text-green-500">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold pt-4 text-green-700">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1 marker:text-green-500">
              {job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-green-500" />
            <span>Posted on {new Date(job.posted_date).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {showApplyForm && (
        <Card className="w-full border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Apply for {job.title}</CardTitle>
            <CardDescription>Fill out the form below to submit your application</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplyForm jobId={job.id} jobTitle={job.title} onSuccess={() => router.push("/")} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
