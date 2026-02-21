import { Link, useParams } from "react-router"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Lock,
  MessageSquare,
} from "lucide-react"
import { dummyForms } from "@/lib/dummy-data"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormButton } from "@/components/shared/form-button"
import { QuestionPreview } from "@/components/forms/question-preview"

export default function FormPreviewPage() {
  const { id } = useParams()
  const form = dummyForms.find((f) => f.id === id)

  if (!form) {
    throw new Response("Form not found", { status: 404 })
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
                  {form.responseCount} responses
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {form.createdAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated {form.updatedAt}
                </span>
              </div>
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
              This is a read-only preview. Form submission is disabled.
            </p>
            <FormButton disabled size="lg">
              Submit (Preview Mode)
            </FormButton>
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

      <Footer />
    </div>
  )
}
