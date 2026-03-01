import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/app/context/toast-context"
import { register } from "@/lib/api"

export default function RegisterPage() {
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuth()
    const { success, error: showError } = useToast()

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/forms")
        }
    }, [user, authLoading, navigate])

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState<Partial<typeof form>>({})

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }

    function validate() {
        const newErrors: Partial<typeof form> = {}

        if (!form.email.trim()) newErrors.email = "Email is required"
        if (form.password.length < 8)
            newErrors.password = "Must be at least 8 characters"
        if (form.confirmPassword !== form.password)
            newErrors.confirmPassword = "Passwords do not match"

        return newErrors
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await register(form.email, form.password)
            success("Account created successfully! Please sign in.")
            navigate("/login")
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again."
            showError(msg)
            setErrors({ email: msg })
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center gap-3 animate-fade-in-down">
                        <h1 className="text-2xl font-bold text-foreground">
                            Create your account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Start building beautiful forms in minutes
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-float-in" style={{ animationDelay: '0.15s' }}>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                placeholder="Create a password"
                                required
                                hint="Must be at least 8 characters"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <FormInput
                                label="Confirm password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                required
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />

                            <FormButton type="submit" size="lg" className="mt-2 w-full">
                                Create account
                            </FormButton>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
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