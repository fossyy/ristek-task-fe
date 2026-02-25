import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, Link } from "react-router"
import { Plus, Loader2 } from "lucide-react"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormButton } from "@/components/shared/form-button"
import { FormCard } from "@/components/forms/form-card"
import { FormsToolbar } from "@/components/forms/forms-toolbar"
import { useAuth } from "@/app/context/auth-context"
import { getForms } from "@/lib/api"
import type { FormSummary } from "@/lib/types"

type StatusFilter = "all" | "has_responses" | "no_responses"
type SortBy = "created_at" | "updated_at"
type SortDir = "newest" | "oldest"

const DEBOUNCE_MS = 400

export default function FormsPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<SortBy>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("newest")
  const [forms, setForms] = useState<FormSummary[]>([])
  const [totalForms, setTotalForms] = useState(0)
  const [loadingForms, setLoadingForms] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [user, loading, navigate])

  const fetchForms = useCallback(async (params: {
    search: string
    statusFilter: StatusFilter
    sortBy: SortBy
    sortDir: SortDir
  }) => {
    setError(null)
    setLoadingForms(true)
    try {
      const data = await getForms({
        search: params.search || undefined,
        status: params.statusFilter === "all" ? undefined : params.statusFilter,
        sort_by: params.sortBy,
        sort_dir: params.sortDir,
      })
      setForms(data)
      if (isInitialLoad.current) {
        setTotalForms(data.length)
        isInitialLoad.current = false
      }
    } catch {
      setError("Failed to load forms. Please try again.")
    } finally {
      setLoadingForms(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    fetchForms({ search, statusFilter, sortBy, sortDir })
  }, [user])

  useEffect(() => {
    if (!user || isInitialLoad.current) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetchForms({ search, statusFilter, sortBy, sortDir })
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search, statusFilter, sortBy, sortDir, user, fetchForms])

  const hasActiveFilters = search !== "" || statusFilter !== "all"

  function clearAllFilters() {
    setSearch("")
    setStatusFilter("all")
    setSortBy("created_at")
    setSortDir("newest")
  }

  if (loading || loadingForms) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Forms</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and preview all your forms in one place
              </p>
            </div>
            <Link to="/forms/new">
              <FormButton size="md">
                <Plus className="h-4 w-4" />
                New Form
              </FormButton>
            </Link>
          </div>

          <div className="mb-6">
            <FormsToolbar
              search={search}
              status={statusFilter}
              sortBy={sortBy}
              sortDir={sortDir}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
              onSortChange={setSortBy}
              onOrderChange={setSortDir}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loadingForms ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Searching...
                </span>
              ) : (
                <>Showing {forms.length}{totalForms > 0 ? ` of ${totalForms}` : ""} forms</>
              )}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {error ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <p className="text-sm text-destructive">{error}</p>
              <FormButton
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </FormButton>
            </div>
          ) : forms.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {forms.map((form, index) => (
                <div key={form.id} className="animate-float-in" style={{ animationDelay: `${index * 0.08}s` }}>
                  <FormCard form={form} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
              <p className="text-sm text-muted-foreground">
                No forms found matching your criteria.
              </p>
              <FormButton
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={clearAllFilters}
              >
                Clear filters
              </FormButton>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
