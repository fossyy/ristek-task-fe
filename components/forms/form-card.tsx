import {
  Calendar,
  Eye,
  FileText,
  MessageSquare,
} from "lucide-react"
import type { Form } from "@/lib/dummy-data"
import { FormButton } from "@/components/shared/form-button"
import { Link } from "react-router";

interface FormCardProps {
  form: Form
}

export function FormCard({ form }: FormCardProps) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="h-1.5 rounded-t-xl bg-primary" />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <h3 className="text-base font-semibold leading-snug text-foreground text-pretty">
            {form.title}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {form.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {form.questions.length} questions
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {form.responseCount} responses
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {form.updatedAt}
          </span>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <Link to={`/forms/${form.id}`}>
            <FormButton variant="outline" size="sm" className="w-full">
              <Eye className="h-3.5 w-3.5" />
              Preview Form
            </FormButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
