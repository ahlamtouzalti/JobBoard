"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Briefcase, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define categories
const categories = [
  "Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Service",
  "Operations",
  "Finance",
  "HR",
  "Data",
  "Management",
]

export function Header() {
  const router = useRouter()

  const handleCategorySelect = (category: string) => {
    // In a real app, you would navigate to a filtered view
    // For now, we'll just navigate to the home page
    router.push(`/?category=${category}`)
  }

  return (
    <header className="border-b bg-green-50">
      <div className="w-[90%] mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold text-green-700">JobBoard</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-green-600">
            Home
          </Link>
          <Link href="/#featured-jobs" className="transition-colors hover:text-green-600">
            Featured Jobs
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 transition-colors hover:text-green-600">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="cursor-pointer"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/#about" className="transition-colors hover:text-green-600">
            About Us
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/admin/login">
            <Button
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
