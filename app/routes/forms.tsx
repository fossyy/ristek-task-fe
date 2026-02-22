import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, Link } from "react-router"
import { Plus, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"
import { FormCard } from "@/components/forms/form-card"
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

  // Initial fetch
  useEffect(() => {
    if (!user) return
    fetchForms({ search, statusFilter, sortBy, sortDir })
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced fetch when filters change (skip initial)
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

          <div className="mb-6 flex flex-col gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <FormInput
                placeholder="Search forms by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
              <div className="relative col-span-2 sm:col-span-1">
                <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-card pl-8 pr-8 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="all">All Status</option>
                  <option value="has_responses">Has Responses</option>
                  <option value="no_responses">No Responses</option>
                </select>
              </div>

              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-card pl-8 pr-8 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="created_at">Sort: Created</option>
                  <option value="updated_at">Sort: Updated</option>
                </select>
              </div>

              <div className="relative">
                <select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value as SortDir)}
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-card pl-8 pr-8 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
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
              {forms.map((form) => (
                <FormCard key={form.id} form={form} />
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
