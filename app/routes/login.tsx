"use client"

import { Link } from "react-router";
import { useNavigate } from "react-router";
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"

export default function LoginPage() {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate("/forms")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your FormCraft account
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FormInput
                label="Email"
                type="email"
                placeholder="bagas@example.com"
                required
                autoComplete="email"
              />
              <FormInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Remember me
                </label>
                <Link
                  to="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <FormButton type="submit" size="lg" className="mt-2 w-full">
                Sign in
              </FormButton>
            </form>


          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
