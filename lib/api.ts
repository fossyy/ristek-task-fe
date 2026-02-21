import {
  type User,
  getToken,
  setTokens,
  clearTokens,
  isTokenExpired,
  decodeJWT,
} from "@/lib/auth"
import type { FormSummary, FormDetail, CreateFormPayload, UpdateFormPayload } from "@/lib/types"

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const refreshToken = getToken("refresh_token")
  if (!refreshToken) {
    clearTokens()
    return null
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) {
      clearTokens()
      return null
    }

    const data = await res.json()
    setTokens(data.access_token, data.refresh_token)
    return data.access_token
  } catch {
    clearTokens()
    return null
  }
}

async function getAccessTokenAsync(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const token = getToken("access_token")
  if (token && !isTokenExpired(token)) return token

  return refreshAccessToken()
}

export async function getUserAsync(): Promise<User | null> {
  if (typeof window === "undefined") return null

  let token = getToken("access_token")

  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken()
    if (!token) return null
  }

  const payload = decodeJWT(token)
  if (!payload) return null

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = await getAccessTokenAsync()

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  if (res.status === 401) {
    token = await refreshAccessToken()
    if (token) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      })
    }
  }

  return res
}

export async function login(email: string, password: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Invalid email or password")
  }

  return res.json() as Promise<{ access_token: string; refresh_token: string }>
}

export async function register(email: string, password: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Registration failed")
  }

  return res.json()
}

export async function logout() {
  if (typeof window === "undefined") return

  const token = getToken("access_token")
  const refreshToken = getToken("refresh_token")

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  } catch {
  }

  clearTokens()
}

export async function getForms(): Promise<FormSummary[]> {
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/forms`)

  if (!res.ok) {
    throw new Error("Failed to fetch forms")
  }

  return res.json()
}

export async function getFormById(id: string): Promise<FormDetail> {
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/form/${id}`)

  if (!res.ok) {
    if (res.status === 404) {
      throw new Response("Form not found", { status: 404 })
    }
    throw new Error("Failed to fetch form")
  }

  return res.json()
}

export async function createForm(payload: CreateFormPayload): Promise<FormDetail> {
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/form`, {
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
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/form/${id}`, {
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
  const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/form/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? "Failed to delete form")
  }
}