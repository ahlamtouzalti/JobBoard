"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "@/app/actions/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    const result = await signIn(formData)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      })
      router.push("/admin/dashboard")
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <Card className="w-full max-w-md border-green-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-700">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-green-700">
                  Password
                </Label>
                <Button variant="link" className="p-0 h-auto text-sm text-green-600 hover:text-green-700" type="button">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                className="border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">For demo purposes, use: admin@example.com / password</div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
