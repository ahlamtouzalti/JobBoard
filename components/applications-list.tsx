"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getApplications, updateApplicationStatus } from "@/app/actions/applications"
import type { Application } from "@/types"

export function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true)
      const applicationsData = await getApplications()
      setApplications(applicationsData)
      setLoading(false)
    }

    fetchApplications()
  }, [])

  const handleViewClick = (application: Application) => {
    setSelectedApplication(application)
    setViewDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
            New
          </Badge>
        )
      case "Reviewed":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 hover:text-purple-700">
            Reviewed
          </Badge>
        )
      case "Interviewed":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700">
            Interviewed
          </Badge>
        )
      case "Hired":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
            Hired
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    const result = await updateApplicationStatus(id, newStatus)

    if (result.success) {
      setApplications(applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
      setViewDialogOpen(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>
  }

  return (
    <>
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-2">No applications yet</p>
          <p className="text-muted-foreground">Applications will appear here when candidates apply for jobs.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.full_name}</div>
                    <div className="text-sm text-muted-foreground">{application.email}</div>
                  </div>
                </TableCell>
                <TableCell>{application.job_title}</TableCell>
                <TableCell>{new Date(application.created_at || "").toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewClick(application)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {application.resume_url && (
                      <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {selectedApplication && (
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>Review the application for {selectedApplication.job_title}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-3">{selectedApplication.full_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedApplication.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Phone:</div>
                <div className="col-span-3">{selectedApplication.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Position:</div>
                <div className="col-span-3">{selectedApplication.job_title}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Applied:</div>
                <div className="col-span-3">{new Date(selectedApplication.created_at || "").toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3">{getStatusBadge(selectedApplication.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Cover Letter:</div>
                <div className="col-span-3">
                  <p className="text-sm text-muted-foreground">{selectedApplication.cover_letter}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => updateStatus(selectedApplication.id, "Rejected")}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => updateStatus(selectedApplication.id, "Interviewed")}>
                  Schedule Interview
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => updateStatus(selectedApplication.id, "Hired")}
                >
                  <CheckCircle className="h-4 w-4" />
                  Hire
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
