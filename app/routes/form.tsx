import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router"
import {
  AlertTriangle,
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
import { useToast } from "@/app/context/toast-context"
import type { FormDetail } from "@/lib/types"

export default function FormPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [form, setForm] = useState<FormDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [showEditWarning, setShowEditWarning] = useState(false)

  const CONFIRM_PHRASE = "Aku suka femboy jadi hapus form ini"

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
      success("Form deleted successfully.")
      navigate("/forms")
    } catch {
      showError("Failed to delete form.")
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

          <div className="mb-8 rounded-xl border border-border bg-card shadow-sm animate-float-in">
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
                  {form.response_count > 0 ? (
                    <FormButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditWarning(true)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </FormButton>
                  ) : (
                    <Link to={`/form/${id}/edit`}>
                      <FormButton type="button" variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </FormButton>
                    </Link>
                  )}
                  <FormButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setConfirmText("")
                      setShowDeleteConfirm(true)
                    }}
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
              <div key={question.id} className="animate-fade-in-up" style={{ animationDelay: `${0.15 + index * 0.08}s` }}>
                <QuestionPreview
                  question={question}
                  index={index}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
            {form.response_count > 0 ? (
              <>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-center text-lg font-semibold text-card-foreground">Delete Form with Responses</h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  This form has <span className="font-semibold text-foreground">{form.response_count} response{form.response_count > 1 ? "s" : ""}</span>. Deleting it will permanently remove all responses. This action cannot be undone.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  To confirm, type <span className="font-mono font-semibold text-foreground">{CONFIRM_PHRASE}</span> below:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type the phrase above"
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <div className="mt-5 flex items-center justify-end gap-3">
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
                    disabled={deleting || confirmText !== CONFIRM_PHRASE}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting..." : "Delete Forever"}
                  </FormButton>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-card-foreground">Delete Form</h2>
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
              </>
            )}
          </div>
        </div>
      )}

      {showEditWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-center text-lg font-semibold text-card-foreground">Cannot Edit Form</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              This form already has <span className="font-semibold text-foreground">{form.response_count} response{form.response_count > 1 ? "s" : ""}</span>. Editing a form with existing responses is not allowed to preserve data integrity.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link to={`/form/${id}/responses`}>
                <FormButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Responses
                </FormButton>
              </Link>
              <FormButton
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowEditWarning(false)}
              >
                Close
              </FormButton>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
