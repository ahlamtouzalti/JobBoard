"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, DollarSign, MapPin, Tag } from "lucide-react"
import { CategoryFilter } from "@/components/category-filter"
import { CategoriesSection } from "@/components/categories-section"
import { getJobs } from "./actions/jobs"
import { getCategories } from "./actions/categories"
import type { Job, Category } from "@/types"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const jobsData = await getJobs(selectedCategory || undefined)
      const categoriesData = await getCategories()

      setJobs(jobsData)
      setCategories(categoriesData)
      setLoading(false)
    }

    fetchData()
  }, [selectedCategory])

  const categoryNames = categories.map((cat) => cat.name)

  return (
    <div className="py-10 flex flex-col items-center">
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-3xl font-bold text-green-700">Job Offers</h1>
        <CategoryFilter
          categories={categoryNames}
          selectedCategory={selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name || null : null}
          onCategoryChange={(category) => {
            const cat = categories.find((c) => c.name === category)
            setSelectedCategory(cat ? cat.id : null)
          }}
        />
      </div>

      {loading ? (
        <div className="w-full text-center py-12">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="w-full text-center py-12">
          <p className="text-lg mb-4">No jobs found</p>
          <p className="text-muted-foreground">Try changing your filter or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="h-full flex flex-col border-green-100 hover:border-green-200 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-green-700">{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-green-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-green-500" />
                    <span>{job.category}</span>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/jobs/${job.id}`} className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CategoriesSection categories={categoryNames} />
    </div>
  )
}
