import { useState, useEffect, useRef } from "react"
import { Search, Filter, ArrowUpDown, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "has_responses" | "no_responses"
type SortBy = "created_at" | "updated_at"
type SortDir = "newest" | "oldest"

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All Status", value: "all" },
  { label: "Has Responses", value: "has_responses" },
  { label: "No Responses", value: "no_responses" },
]

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
]

const ORDER_OPTIONS: { label: string; value: SortDir }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
]

interface FormsToolbarProps {
  search: string
  status: StatusFilter
  sortBy: SortBy
  sortDir: SortDir
  onSearchChange: (value: string) => void
  onStatusChange: (status: StatusFilter) => void
  onSortChange: (sort: SortBy) => void
  onOrderChange: (order: SortDir) => void
}

export function FormsToolbar({
  search,
  status,
  sortBy,
  sortDir,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onOrderChange,
}: FormsToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name))
  }

  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "All Status"
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Created"
  const orderLabel = ORDER_OPTIONS.find((o) => o.value === sortDir)?.label ?? "Newest first"

  return (
    <div ref={toolbarRef} className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search forms by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="h-px w-full bg-border md:hidden" />
        <div className="hidden md:block w-px self-stretch bg-border" />

        <div className="flex flex-wrap items-center gap-1 px-3 py-2 md:shrink-0 md:flex-nowrap md:px-2 md:py-1.5">
          <ToolbarDropdown
            icon={<Filter className="h-3.5 w-3.5" />}
            label={statusLabel}
            open={openDropdown === "status"}
            onToggle={() => toggleDropdown("status")}
            options={STATUS_OPTIONS}
            value={status}
            onSelect={(v) => {
              onStatusChange(v)
              setOpenDropdown(null)
            }}
          />

          <ToolbarDropdown
            icon={<ArrowUpDown className="h-3.5 w-3.5" />}
            label={`Sort: ${sortLabel}`}
            open={openDropdown === "sort"}
            onToggle={() => toggleDropdown("sort")}
            options={SORT_OPTIONS}
            value={sortBy}
            onSelect={(v) => {
              onSortChange(v)
              setOpenDropdown(null)
            }}
          />

          <ToolbarDropdown
            icon={<Clock className="h-3.5 w-3.5" />}
            label={orderLabel}
            open={openDropdown === "order"}
            onToggle={() => toggleDropdown("order")}
            options={ORDER_OPTIONS}
            value={sortDir}
            onSelect={(v) => {
              onOrderChange(v)
              setOpenDropdown(null)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ToolbarDropdown<T extends string>({
  icon,
  label,
  open,
  onToggle,
  options,
  value,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  open: boolean
  onToggle: () => void
  options: { label: string; value: T }[]
  value: T
  onSelect: (value: T) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
          open
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={cn(
                "flex w-full items-center rounded-md px-2.5 py-1.5 text-xs transition-colors",
                option.value === value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-popover-foreground hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
