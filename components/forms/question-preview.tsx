import {
  Calendar,
  ChevronDown,
  Star,
} from "lucide-react"
import type { Question } from "@/lib/dummy-data"

interface QuestionPreviewProps {
  question: Question
  index: number
}

export function QuestionPreview({ question, index }: QuestionPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Question header */}
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

      {/* Read-only field preview */}
      <div className="pl-10">
        {question.type === "short_text" && (
          <div className="rounded-lg border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
            Short answer text
          </div>
        )}

        {question.type === "long_text" && (
          <div className="min-h-[80px] rounded-lg border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
            Long answer text
          </div>
        )}

        {question.type === "multiple_choice" && question.options && (
          <div className="flex flex-col gap-2.5">
            {question.options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2.5 text-sm text-foreground"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-input" />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === "checkbox" && question.options && (
          <div className="flex flex-col gap-2.5">
            {question.options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2.5 text-sm text-foreground"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-input" />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === "dropdown" && (
          <div className="flex items-center justify-between rounded-lg border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
            <span>Select an option</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        )}

        {question.type === "date" && (
          <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>mm / dd / yyyy</span>
          </div>
        )}

        {question.type === "rating" && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-6 w-6 text-input"
                strokeWidth={1.5}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
