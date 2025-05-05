import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Employee Management System</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Login to access the employee management system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/login?role=supervisor">Login as Supervisor</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/login?role=employee">Login as Employee</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Employee Management System v1.0
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-4">
        <div className="container flex justify-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Employee Management System
        </div>
      </footer>
    </div>
  )
}
