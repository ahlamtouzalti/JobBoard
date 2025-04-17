import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tag } from "lucide-react"

interface CategoriesSectionProps {
  categories: string[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section id="categories" className="py-12">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link key={category} href={`/?category=${category}`}>
            <Card className="h-full hover:border-green-300 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Tag className="h-8 w-8 mb-2 text-green-600" />
                <span className="font-medium text-green-700">{category}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
