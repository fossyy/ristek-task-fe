"use client"

import { Link } from "react-router";
import { useNavigate } from "react-router";
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"

export default function RegisterPage() {
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start building beautiful forms in minutes
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <FormInput
                  label="First name"
                  type="text"
                  placeholder="bagas"
                  required
                  autoComplete="given-name"
                  className="w-full"
                />
                <FormInput
                  label="Last name"
                  type="text"
                  placeholder="pacil"
                  required
                  autoComplete="family-name"
                  className="w-full"
                />
              </div>
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
                placeholder="Create a password"
                required
                hint="Must be at least 8 characters"
                autoComplete="new-password"
              />
              <FormInput
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />

              <FormButton type="submit" size="lg" className="mt-2 w-full">
                Create account
              </FormButton>
            </form>


          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
