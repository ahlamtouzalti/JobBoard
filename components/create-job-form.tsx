"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createJob } from "@/app/actions/jobs"
import { getCategories } from "@/app/actions/categories"
import type { Category } from "@/types"

interface CreateJobFormProps {
  onSuccess: () => void
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    company: "Your Company",
    location: "",
    type: "Full-time",
    salary: "",
    category_id: "",
    description: "",
    requirements: "",
    responsibilities: "",
  })

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      const categoriesData = await getCategories()
      setCategories(categoriesData)
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    const result = await createJob(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Job Created",
        description: `The job listing for ${result.data.title} has been created successfully.`,
      })
      onSuccess()
    } else {
      toast({
        title: "Error",
        description: result.error || "There was an error creating the job. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading form...</div>
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-green-700">
            Job Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Frontend Developer"
            className="border-green-200 focus-visible:ring-green-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-green-700">
            Company
          </Label>
          <Input
            id="company"
            name="company"
            defaultValue="Your Company"
            className="border-green-200 focus-visible:ring-green-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-green-700">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. New York, NY or Remote"
            className="border-green-200 focus-visible:ring-green-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-green-700">
            Job Type
          </Label>
          <Select name="type" defaultValue="Full-time">
            <SelectTrigger id="type" className="border-green-200 focus-visible:ring-green-500">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category_id" className="text-green-700">
            Category
          </Label>
          <Select name="category_id">
            <SelectTrigger id="category_id" className="border-green-200 focus-visible:ring-green-500">
              <SelectValue placeholder="Select job category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary" className="text-green-700">
            Salary Range
          </Label>
          <Input
            id="salary"
            name="salary"
            placeholder="e.g. $80,000 - $100,000"
            className="border-green-200 focus-visible:ring-green-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Provide a detailed description of the job"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          rows={4}
          placeholder="List each requirement on a new line"
          required
        />
        <p className="text-sm text-muted-foreground">Enter each requirement on a new line</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities">Responsibilities</Label>
        <Textarea
          id="responsibilities"
          name="responsibilities"
          rows={4}
          placeholder="List each responsibility on a new line"
          required
        />
        <p className="text-sm text-muted-foreground">Enter each responsibility on a new line</p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Job..." : "Create Job Listing"}
      </Button>
    </form>
  )
}
