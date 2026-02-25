import { useState, useEffect, useMemo } from "react"
import { Link, useParams, useNavigate } from "react-router"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormButton } from "@/components/shared/form-button"
import { useAuth } from "@/app/context/auth-context"
import { getFormById, getFormResponses } from "@/lib/api"
import type { FormDetail, FormResponse, Question, QuestionType } from "@/lib/types"

const CHART_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(262, 83%, 58%)",
  "hsl(172, 66%, 50%)",
  "hsl(326, 80%, 55%)",
  "hsl(25, 95%, 53%)",
  "hsl(199, 89%, 48%)",
  "hsl(47, 96%, 53%)",
]

type TabType = "summary" | "individual"

export default function FormResponsesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [form, setForm] = useState<FormDetail | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("summary")

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login")
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!id || !user) return

    async function fetchData() {
      try {
        const [formData, responsesData] = await Promise.all([
          getFormById(id!),
          getFormResponses(id!),
        ])
        setForm(formData)
        setResponses(responsesData)
      } catch (err) {
        if (err instanceof Response && err.status === 404) {
          setError("Form not found")
        } else {
          setError("Failed to load responses. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading responses...</p>
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

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
          <Link
            to={`/form/${id}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to form
          </Link>

          <div className="mb-8 rounded-xl border border-border bg-card shadow-sm animate-float-in">
            <div className="h-2 rounded-t-xl bg-primary" />
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                    {form.title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {form.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/form/${id}`}>
                    <FormButton variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                      Preview
                    </FormButton>
                  </Link>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                <StatCard
                  icon={<Users className="h-4 w-4 text-primary" />}
                  label="Responses"
                  value={responses.length}
                />
                <StatCard
                  icon={<FileText className="h-4 w-4 text-primary" />}
                  label="Questions"
                  value={form.questions.length}
                />
                <StatCard
                  icon={<Calendar className="h-4 w-4 text-primary" />}
                  label="Created"
                  value={new Date(form.created_at).toLocaleDateString()}
                />
                <StatCard
                  icon={<Clock className="h-4 w-4 text-primary" />}
                  label="Last response"
                  value={
                    responses.length > 0
                      ? new Date(responses[0].submitted_at).toLocaleDateString()
                      : "—"
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "summary"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="mr-1.5 inline-block h-4 w-4" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab("individual")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "individual"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="mr-1.5 inline-block h-4 w-4" />
              Individual ({responses.length})
            </button>
          </div>

          {responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
              <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No responses yet. Share this form to start collecting data.
              </p>
              <Link to={`/form/${id}/submit`} className="mt-3">
                <FormButton variant="outline" size="sm">
                  View submission page
                </FormButton>
              </Link>
            </div>
          ) : activeTab === "summary" ? (
            <SummaryTab form={form} responses={responses} />
          ) : (
            <IndividualTab form={form} responses={responses} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

function SummaryTab({
  form,
  responses,
}: {
  form: FormDetail
  responses: FormResponse[]
}) {
  return (
    <div className="flex flex-col gap-6">
      {form.questions.map((question, index) => (
        <QuestionSummary
          key={question.id}
          question={question}
          index={index}
          responses={responses}
          totalResponses={responses.length}
        />
      ))}
    </div>
  )
}

function QuestionSummary({
  question,
  index,
  responses,
  totalResponses,
}: {
  question: Question
  index: number
  responses: FormResponse[]
  totalResponses: number
}) {
  const answersForQuestion = useMemo(() => {
    return responses
      .map((r) => r.answers.find((a) => a.question_id === question.id))
      .filter(Boolean)
  }, [responses, question.id])

  const responseCount = answersForQuestion.length
  const skipped = totalResponses - responseCount

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              {question.title}
              {question.required && (
                <span className="ml-1 text-destructive">*</span>
              )}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="capitalize">{question.type.replace("_", " ")}</span>
              <span>·</span>
              <span>{responseCount} answers</span>
              {skipped > 0 && (
                <>
                  <span>·</span>
                  <span>{skipped} skipped</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {hasChartableType(question.type) ? (
          <ChartVisualization
            question={question}
            responses={responses}
          />
        ) : (
          <TextResponses
            questionId={question.id}
            responses={responses}
          />
        )}
      </div>
    </div>
  )
}

function hasChartableType(type: QuestionType): boolean {
  return ["multiple_choice", "checkbox", "dropdown", "rating"].includes(type)
}

function ChartVisualization({
  question,
  responses,
}: {
  question: Question
  responses: FormResponse[]
}) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}

    if (["multiple_choice", "dropdown"].includes(question.type)) {
      question.options.forEach((opt) => {
        counts[opt.label] = 0
      })
    }

    if (question.type === "checkbox") {
      question.options.forEach((opt) => {
        counts[opt.label] = 0
      })
    }

    if (question.type === "rating") {
      for (let i = 1; i <= 5; i++) {
        counts[String(i)] = 0
      }
    }

    responses.forEach((r) => {
      const answer = r.answers.find((a) => a.question_id === question.id)
      if (!answer) return

      if (question.type === "checkbox") {
        const selected = answer.answer.split(",").map((s) => s.trim())
        selected.forEach((s) => {
          counts[s] = (counts[s] || 0) + 1
        })
      } else {
        counts[answer.answer] = (counts[answer.answer] || 0) + 1
      }
    })

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }))
  }, [question, responses])

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  if (question.type === "rating") {
    const avgRating = useMemo(() => {
      let sum = 0
      let count = 0
      responses.forEach((r) => {
        const answer = r.answers.find((a) => a.question_id === question.id)
        if (answer) {
          sum += Number(answer.answer)
          count++
        }
      })
      return count > 0 ? (sum / count).toFixed(1) : "—"
    }, [responses, question.id])

    return (
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl font-bold text-foreground">{avgRating}</span>
          <span className="text-sm text-muted-foreground">average rating out of 5</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v} ★`}
              className="fill-muted-foreground"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="mx-auto w-full max-w-[220px] sm:mx-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number | undefined) => [
                `${value ?? 0} (${total > 0 ? (((value ?? 0) / total) * 100).toFixed(0) : 0}%)`,
                "Responses",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="flex-1 text-sm text-foreground">{item.name}</span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
            <span className="w-12 text-right text-xs text-muted-foreground">
              {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TextResponses({
  questionId,
  responses,
}: {
  questionId: string
  responses: FormResponse[]
}) {
  const [showAll, setShowAll] = useState(false)
  const textAnswers = useMemo(() => {
    return responses
      .map((r) => {
        const answer = r.answers.find((a) => a.question_id === questionId)
        return answer
          ? { text: answer.answer, date: r.submitted_at }
          : null
      })
      .filter(Boolean) as { text: string; date: string }[]
  }, [responses, questionId])

  if (textAnswers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No responses for this question.</p>
    )
  }

  const visible = showAll ? textAnswers : textAnswers.slice(0, 5)

  return (
    <div>
      <div className="flex flex-col gap-2">
        {visible.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-background px-4 py-3"
          >
            <p className="text-sm text-foreground">{item.text}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(item.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {textAnswers.length > 5 && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          {showAll ? "Show less" : `Show all ${textAnswers.length} responses`}
        </button>
      )}
    </div>
  )
}

function IndividualTab({
  form,
  responses,
}: {
  form: FormDetail
  responses: FormResponse[]
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const sorted = useMemo(
    () =>
      [...responses].sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      ),
    [responses]
  )

  const current = sorted[selectedIndex]
  if (!current) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <button
          onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
          disabled={selectedIndex === 0}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
        >
          ← Previous
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Response {selectedIndex + 1} of {sorted.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(current.submitted_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() =>
            setSelectedIndex((i) => Math.min(sorted.length - 1, i + 1))
          }
          disabled={selectedIndex === sorted.length - 1}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {form.questions.map((question, index) => {
          const answer = current.answers.find(
            (a) => a.question_id === question.id
          )
          return (
            <div
              key={question.id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {question.title}
                    {question.required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </h3>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {question.type.replace("_", " ")}
                  </p>
                  {answer ? (
                    <div className="mt-3 rounded-lg border border-border bg-background px-4 py-2.5">
                      <p className="text-sm text-foreground">{answer.answer}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm italic text-muted-foreground">
                      No answer (skipped)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
