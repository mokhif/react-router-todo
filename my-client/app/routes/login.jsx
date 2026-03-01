// app/routes/login.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">Sign in to your todo account</p>
        </div>

        {/* Card */}
        <Card className="p-6 border-border bg-card space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="bg-background text-foreground border-border"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="bg-background text-foreground border-border"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Sign in
          </Button>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
