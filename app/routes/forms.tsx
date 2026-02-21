"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { dummyForms } from "@/lib/dummy-data"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { FormInput } from "@/components/shared/form-input"
import { FormButton } from "@/components/shared/form-button"
import { FormCard } from "@/components/forms/form-card"

export default function FormsPage() {
  const [search, setSearch] = useState("")

  const filtered = dummyForms.filter((form) => {
    return (
      form.title.toLowerCase().includes(search.toLowerCase()) ||
      form.description.toLowerCase().includes(search.toLowerCase())
    )
  })

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
            <FormButton size="md">
              <Plus className="h-4 w-4" />
              New Form
            </FormButton>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <FormInput
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Showing {filtered.length} of {dummyForms.length} forms
          </p>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((form) => (
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
                onClick={() => setSearch("")}
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
