import { fetchWithAuth } from "@/lib/auth"
import type { FormSummary, FormDetail, CreateFormPayload, UpdateFormPayload } from "@/lib/types"

const API_BASE = "http://localhost:8080"

export async function getForms(): Promise<FormSummary[]> {
  const res = await fetchWithAuth(`${API_BASE}/api/forms`)

  if (!res.ok) {
    throw new Error("Failed to fetch forms")
  }

  return res.json()
}

export async function getFormById(id: string): Promise<FormDetail> {
  const res = await fetchWithAuth(`${API_BASE}/api/form/${id}`)

  if (!res.ok) {
    if (res.status === 404) {
      throw new Response("Form not found", { status: 404 })
    }
    throw new Error("Failed to fetch form")
  }

  return res.json()
}

export async function createForm(payload: CreateFormPayload): Promise<FormDetail> {
  const res = await fetchWithAuth(`${API_BASE}/api/form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Failed to create form")
  }

  return res.json()
}

export async function updateForm(id: string, payload: UpdateFormPayload): Promise<FormDetail> {
  const res = await fetchWithAuth(`${API_BASE}/api/form/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Failed to update form")
  }

  return res.json()
}

export async function deleteForm(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/api/form/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Failed to delete form")
  }
}