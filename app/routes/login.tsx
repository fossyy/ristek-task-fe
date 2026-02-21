import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"
import { useAuth } from "@/app/context/auth-context"
import { setTokens } from "@/lib/auth"
import { login } from "@/lib/api"

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/forms")
    }
  }, [user, authLoading, navigate])

  const [form, setForm] = useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  function validate() {
    const newErrors: Partial<typeof form> = {}
    if (!form.email.trim()) newErrors.email = "Email is required"
    if (!form.password) newErrors.password = "Password is required"
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      setTokens(data.access_token, data.refresh_token, rememberMe)
      refreshUser()
      navigate("/forms")
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
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
              {errors.general && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errors.general}
                </p>
              )}

              <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="bagas@example.com"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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

              <FormButton
                type="submit"
                size="lg"
                className="mt-2 w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
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