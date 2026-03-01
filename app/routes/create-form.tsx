import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"
import { QuestionEditor } from "@/components/forms/question-editor"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/app/context/toast-context"
import { createForm } from "@/lib/api"
import type { CreateQuestion } from "@/lib/types"

const TYPES_WITH_OPTIONS = ["multiple_choice", "checkbox", "dropdown"]

export default function CreateFormPage() {
  const { user, loading: authLoading } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<CreateQuestion[]>([
    { type: "short_text", title: "", required: false, position: 1, options: [] },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login")
    }
  }, [user, authLoading, navigate])

  if (authLoading || !user) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Form title is required.")
      return
    }

    const hasEmptyQuestion = questions.some((q) => !q.title.trim())
    if (hasEmptyQuestion) {
      setError("All questions must have a title.")
      return
    }

    const hasEmptyOption = questions.some(
      (q) =>
        TYPES_WITH_OPTIONS.includes(q.type) &&
        (q.options.length === 0 || q.options.some((o) => !o.label.trim()))
    )
    if (hasEmptyOption) {
      setError("All options must have a label.")
      return
    }

    setSubmitting(true)
    try {
      const result = await createForm({
        title: title.trim(),
        description: description.trim(),
        questions,
      })
      success("Form created successfully!")
      navigate(`/form/${result.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create form."
      showError(msg)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <Link
            to="/forms"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to forms
          </Link>

          <h1 className="mb-6 text-2xl font-bold text-foreground animate-fade-in-up">
            Create New Form
          </h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm animate-float-in" style={{ animationDelay: '0.1s' }}>
              <div className="h-2 -mx-6 -mt-6 mb-6 rounded-t-xl bg-primary" />
              <div className="flex flex-col gap-4">
                <FormInput
                  label="Form Title"
                  placeholder="Enter form title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter form description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </div>

            <QuestionEditor questions={questions} onChange={setQuestions} />

            <div className="mt-8 flex items-center justify-end gap-3">
              <Link to="/forms">
                <FormButton type="button" variant="ghost" size="md">
                  Cancel
                </FormButton>
              </Link>
              <FormButton type="submit" size="md" disabled={submitting}>
                {submitting ? "Creating..." : "Create Form"}
              </FormButton>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
