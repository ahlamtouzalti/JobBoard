"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createApplication } from "@/app/actions/applications"

interface ApplyFormProps {
  jobId: number
  jobTitle: string
  onSuccess: () => void
}

export function ApplyForm({ jobId, jobTitle, onSuccess }: ApplyFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    // Add job_id to the form data
    formData.append("job_id", jobId.toString())

    const result = await createApplication(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Application Submitted",
        description: `Your application for ${jobTitle} has been received. We'll be in touch soon!`,
      })
      onSuccess()
    } else {
      toast({
        title: "Error",
        description: result.error || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-green-700">
          Full Name
        </Label>
        <Input id="full_name" name="full_name" className="border-green-200 focus-visible:ring-green-500" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-green-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="border-green-200 focus-visible:ring-green-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-green-700">
          Phone Number
        </Label>
        <Input id="phone" name="phone" type="tel" className="border-green-200 focus-visible:ring-green-500" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_letter" className="text-green-700">
          Cover Letter
        </Label>
        <Textarea
          id="cover_letter"
          name="cover_letter"
          rows={5}
          placeholder="Tell us why you're interested in this position and what makes you a good fit."
          className="border-green-200 focus-visible:ring-green-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume" className="text-green-700">
          Resume/CV
        </Label>
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          className="border-green-200 focus-visible:ring-green-500"
          required
        />
        <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  )
}
