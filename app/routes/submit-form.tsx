import { useState, useEffect } from "react"
import { useParams, Link } from "react-router"
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Star,
  ChevronDown,
  Calendar,
  Send,
} from "lucide-react"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormButton } from "@/components/shared/form-button"
import { useToast } from "@/app/context/toast-context"
import { getFormById, submitFormResponse } from "@/lib/api"
import type { FormDetail, Question } from "@/lib/types"

export default function SubmitFormPage() {
  const { id } = useParams()
  const [form, setForm] = useState<FormDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { success, error: showError } = useToast()

  useEffect(() => {
    if (!id) return

    async function fetchForm() {
      try {
        const data = await getFormById(id!)
        setForm(data)
        const initial: Record<string, string> = {}
        data.questions.forEach((q) => {
          initial[q.id] = ""
        })
        setAnswers(initial)
      } catch (err) {
        if (err instanceof Response && err.status === 404) {
          setError("Form not found")
        } else {
          setError("Failed to load form. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchForm()
  }, [id])

  function updateAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  function validate(): boolean {
    if (!form) return false
    const errors: Record<string, string> = {}

    form.questions.forEach((q) => {
      if (q.required && !answers[q.id]?.trim()) {
        errors[q.id] = "This question is required"
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !form) return

    if (!validate()) {
      const firstErrorId = form.questions.find((q) => validationErrors[q.id] || (q.required && !answers[q.id]?.trim()))?.id
      if (firstErrorId) {
        document.getElementById(`question-${firstErrorId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitFormResponse(id, {
        answers: form.questions
          .filter((q) => answers[q.id]?.trim())
          .map((q) => ({
            question_id: q.id,
            answer: answers[q.id].trim(),
          })),
      })
      success("Response submitted successfully!")
      setSubmitted(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit response"
      showError(msg)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    )
  }

  if (error && !form) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Link
              to="/forms"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to forms
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="mx-4 flex max-w-md flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm animate-scale-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 animate-scale-bounce">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Response Submitted!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for filling out <span className="font-medium text-foreground">{form?.title}</span>.
              Your response has been recorded.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link to={`/form/${id}/submit`}>
                <FormButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false)
                    if (form) {
                      const initial: Record<string, string> = {}
                      form.questions.forEach((q) => { initial[q.id] = "" })
                      setAnswers(initial)
                    }
                  }}
                >
                  Submit another response
                </FormButton>
              </Link>
              <Link to="/forms">
                <FormButton variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to forms
                </FormButton>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <Link
            to={`/form/${id}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to form preview
          </Link>

          <div className="mb-8 rounded-xl border border-border bg-card shadow-sm animate-float-in">
            <div className="h-2 rounded-t-xl bg-primary" />
            <div className="p-6">
              <h1 className="text-xl font-bold text-foreground text-balance sm:text-2xl">
                {form.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {form.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>{form.questions.length} questions</span>
                <span className="text-destructive">* Required</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {form.questions.map((question, index) => (
              <div key={question.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
                <QuestionField
                  question={question}
                  index={index}
                  value={answers[question.id] ?? ""}
                  onChange={(val) => updateAnswer(question.id, val)}
                  error={validationErrors[question.id]}
                />
              </div>
            ))}

            <div className="mt-4 flex items-center justify-between">
              <FormButton type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit
                  </>
                )}
              </FormButton>
              <button
                type="button"
                onClick={() => {
                  const initial: Record<string, string> = {}
                  form.questions.forEach((q) => { initial[q.id] = "" })
                  setAnswers(initial)
                  setValidationErrors({})
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Clear form
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface QuestionFieldProps {
  question: Question
  index: number
  value: string
  onChange: (value: string) => void
  error?: string
}

function QuestionField({ question, index, value, onChange, error }: QuestionFieldProps) {
  return (
    <div
      id={`question-${question.id}`}
      className={`rounded-xl border bg-card p-5 shadow-sm transition-colors ${
        error ? "border-destructive" : "border-border"
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
          {index + 1}
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {question.title}
            {question.required && (
              <span className="ml-1 text-destructive">*</span>
            )}
          </h3>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {question.type.replace("_", " ")}
          </p>
        </div>
      </div>

      <div className="pl-10">
        {question.type === "short_text" && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}

        {question.type === "long_text" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your answer"
            rows={4}
            className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}

        {question.type === "multiple_choice" && question.options.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.label}
                  checked={value === option.label}
                  onChange={() => onChange(option.label)}
                  className="h-4 w-4 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}

        {question.type === "checkbox" && question.options.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {question.options.map((option) => {
              const selected = value ? value.split(", ") : []
              const isChecked = selected.includes(option.label)
              return (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const next = isChecked
                        ? selected.filter((s) => s !== option.label)
                        : [...selected, option.label]
                      onChange(next.join(", "))
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  {option.label}
                </label>
              )
            })}
          </div>
        )}

        {question.type === "dropdown" && (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select an option</option>
              {question.options.map((option) => (
                <option key={option.id} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}

        {question.type === "date" && (
          <div className="relative">
            <input
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {question.type === "rating" && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(String(star))}
                className="transition-colors hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= Number(value)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-input hover:text-yellow-300"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
            {value && (
              <span className="ml-2 self-center text-sm text-muted-foreground">
                {value}/5
              </span>
            )}
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  )
}
