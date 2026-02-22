import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Lock,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormButton } from "@/components/shared/form-button"
import { QuestionPreview } from "@/components/forms/question-preview"
import { getFormById, deleteForm } from "@/lib/api"
import { useAuth } from "@/app/context/auth-context"
import type { FormDetail } from "@/lib/types"

export default function FormPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState<FormDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchForm() {
      try {
        const data = await getFormById(id!)
        setForm(data)
      } catch (err) {
        if (err instanceof Response && err.status === 404) {
          throw err
        }
        setError("Failed to load form. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchForm()
  }, [id])

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    try {
      await deleteForm(id)
      navigate("/forms")
    } catch {
      setError("Failed to delete form.")
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-destructive">{error ?? "Form not found"}</p>
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

          <div className="mb-8 rounded-xl border border-border bg-card shadow-sm">
            <div className="h-2 rounded-t-xl bg-primary" />
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">

                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Read-only preview
                </span>
              </div>

              <h1 className="text-xl font-bold text-foreground text-balance sm:text-2xl">
                {form.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {form.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  {form.questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {form.response_count} responses
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {new Date(form.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {new Date(form.updated_at).toLocaleDateString()}
                </span>
              </div>

              {user && user.id === form.user_id && (
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                  <Link to={`/form/${id}/responses`}>
                    <FormButton type="button" variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4" />
                      Responses
                    </FormButton>
                  </Link>
                  <Link to={`/form/${id}/edit`}>
                    <FormButton type="button" variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </FormButton>
                  </Link>
                  <FormButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </FormButton>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {form.questions.map((question, index) => (
              <QuestionPreview
                key={question.id}
                question={question}
                index={index}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-6">
            <p className="text-sm text-muted-foreground">
              This is a read-only preview. Click below to fill out this form.
            </p>
            <Link to={`/form/${id}/submit`}>
              <FormButton size="lg">
                Fill Out Form
              </FormButton>
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <Link to="/forms">
              <FormButton variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to all forms
              </FormButton>
            </Link>
          </div>
        </div>
      </main>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">Delete Form</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <FormButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </FormButton>
              <FormButton
                type="button"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Delete"}
              </FormButton>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
