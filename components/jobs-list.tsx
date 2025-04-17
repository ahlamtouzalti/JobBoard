"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getJobs, deleteJob } from "@/app/actions/jobs"
import Link from "next/link"
import type { Job } from "@/types"

export function JobsList() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      const jobsData = await getJobs()
      setJobs(jobsData)
      setLoading(false)
    }

    fetchJobs()
  }, [])

  const handleDeleteClick = (jobId: number) => {
    setJobToDelete(jobId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (jobToDelete) {
      const result = await deleteJob(jobToDelete)

      if (result.success) {
        setJobs(jobs.filter((job) => job.id !== jobToDelete))
        toast({
          title: "Job Deleted",
          description: "The job listing has been removed successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "There was an error deleting the job. Please try again.",
          variant: "destructive",
        })
      }

      setDeleteDialogOpen(false)
      setJobToDelete(null)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading jobs...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-green-50">
            <TableHead className="text-green-700">Job Title</TableHead>
            <TableHead className="text-green-700">Location</TableHead>
            <TableHead className="text-green-700">Type</TableHead>
            <TableHead className="text-green-700">Category</TableHead>
            <TableHead className="text-green-700">Applications</TableHead>
            <TableHead className="text-green-700">Status</TableHead>
            <TableHead className="text-right text-green-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="hover:bg-green-50">
              <TableCell className="font-medium text-green-700">{job.title}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.type}</TableCell>
              <TableCell>{job.category}</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job listing and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
