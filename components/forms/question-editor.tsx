import { useState, useRef } from "react"
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { FormInput } from "@/components/shared/form-input"
import type { QuestionType, CreateQuestion } from "@/lib/types"

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
  { value: "date", label: "Date" },
  { value: "rating", label: "Rating" },
]

const TYPES_WITH_OPTIONS: QuestionType[] = ["multiple_choice", "checkbox", "dropdown"]

interface QuestionEditorProps {
  questions: CreateQuestion[]
  onChange: (questions: CreateQuestion[]) => void
}

function reposition(questions: CreateQuestion[]): CreateQuestion[] {
  return questions.map((q, i) => ({ ...q, position: i + 1 }))
}

export function QuestionEditor({ questions, onChange }: QuestionEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragNode = useRef<HTMLDivElement | null>(null)

  function updateQuestion(index: number, updates: Partial<CreateQuestion>) {
    const updated = questions.map((q, i) => {
      if (i !== index) return q
      const merged = { ...q, ...updates }
      if (updates.type && !TYPES_WITH_OPTIONS.includes(merged.type)) {
        merged.options = []
      }
      if (
        updates.type &&
        TYPES_WITH_OPTIONS.includes(merged.type) &&
        merged.options.length === 0
      ) {
        merged.options = [{ label: "", position: 1 }]
      }
      return merged
    })
    onChange(updated)
  }

  function addQuestion() {
    onChange([
      ...questions,
      {
        type: "short_text",
        title: "",
        required: false,
        position: questions.length + 1,
        options: [],
      },
    ])
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return
    onChange(reposition(questions.filter((_, i) => i !== index)))
  }

  function updateOption(qIndex: number, oIndex: number, label: string) {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q
      const options = q.options.map((o, j) =>
        j === oIndex ? { ...o, label } : o
      )
      return { ...q, options }
    })
    onChange(updated)
  }

  function addOption(qIndex: number) {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q
      return {
        ...q,
        options: [...q.options, { label: "", position: q.options.length + 1 }],
      }
    })
    onChange(updated)
  }

  function removeOption(qIndex: number, oIndex: number) {
    const updated = questions.map((q, i) => {
      if (i !== qIndex) return q
      const options = q.options
        .filter((_, j) => j !== oIndex)
        .map((o, j) => ({ ...o, position: j + 1 }))
      return { ...q, options }
    })
    onChange(updated)
  }

  function handleDragStart(index: number, e: React.DragEvent<HTMLDivElement>) {
    setDragIndex(index)
    dragNode.current = e.currentTarget
    e.dataTransfer.effectAllowed = "move"
    requestAnimationFrame(() => {
      if (dragNode.current) {
        dragNode.current.style.opacity = "0.4"
      }
    })
  }

  function handleDragOver(index: number, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragIndex === null || dragIndex === index) return
    setDragOverIndex(index)
  }

  function handleDragEnd() {
    if (dragNode.current) {
      dragNode.current.style.opacity = "1"
    }
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...questions]
      const [moved] = reordered.splice(dragIndex, 1)
      reordered.splice(dragOverIndex, 0, moved)
      onChange(reposition(reordered))
    }
    setDragIndex(null)
    setDragOverIndex(null)
    dragNode.current = null
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            draggable
            onDragStart={(e) => handleDragStart(qIndex, e)}
            onDragOver={(e) => handleDragOver(qIndex, e)}
            onDragEnd={handleDragEnd}
            onDragLeave={() => setDragOverIndex(null)}
            className={`rounded-xl border bg-card p-5 shadow-sm transition-all ${
              dragOverIndex === qIndex && dragIndex !== qIndex
                ? "border-primary ring-2 ring-primary/20"
                : "border-border"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing rounded p-0.5 text-muted-foreground hover:text-foreground"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {qIndex + 1}
                </span>
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <FormInput
                label="Question Title"
                placeholder="Enter question"
                value={question.title}
                onChange={(e) =>
                  updateQuestion(qIndex, { title: e.target.value })
                }
                required
              />

              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          type: e.target.value as QuestionType,
                        })
                      }
                      className="appearance-none rounded-lg border border-input bg-card py-2.5 pl-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <label className="flex items-center gap-2 pb-2.5 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) =>
                      updateQuestion(qIndex, { required: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Required
                </label>
              </div>

              {TYPES_WITH_OPTIONS.includes(question.type) && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Options
                  </label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5 text-center">
                        {oIndex + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option.label}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-1 inline-flex items-center gap-1.5 self-start rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add option
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuestion}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Add Question
      </button>
    </>
  )
}
