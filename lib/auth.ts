export interface User {
  id: string
  email: string
  name?: string
}

export interface JWTPayload {
  sub: string
  email: string
  name?: string
  exp: number
  iat: number
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) return true
  return Date.now() >= payload.exp * 1000
}

function getStorage(): Storage {
  if (typeof window === "undefined") return localStorage
  return localStorage.getItem("remember_me") === "true"
    ? localStorage
    : sessionStorage
}

function getToken(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key)
}

export function setTokens(accessToken: string, refreshToken: string, remember?: boolean) {
  if (typeof window === "undefined") return

  if (remember !== undefined) {
    localStorage.setItem("remember_me", String(remember))
  }

  const storage = remember !== undefined
    ? (remember ? localStorage : sessionStorage)
    : getStorage()

  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")

  storage.setItem("access_token", accessToken)
  storage.setItem("refresh_token", refreshToken)
}

function clearTokens() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("remember_me")
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")
}

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const refreshToken = getToken("refresh_token")
  if (!refreshToken) {
    clearTokens()
    return null
  }

  try {
    const res = await fetch("http://localhost:8080/api/auth/refresh", {
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

export function getUser(): User | null {
  if (typeof window === "undefined") return null

  const token = getToken("access_token")
  if (!token || isTokenExpired(token)) return null

  const payload = decodeJWT(token)
  if (!payload) return null

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  }
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

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null

  const token = getToken("access_token")
  if (!token || isTokenExpired(token)) return null
  return token
}

export async function getAccessTokenAsync(): Promise<string | null> {
  if (typeof window === "undefined") return null

  let token = getToken("access_token")
  if (token && !isTokenExpired(token)) return token

  token = await refreshAccessToken()
  return token
}

export async function logout() {
  if (typeof window === "undefined") return

  const token = getToken("access_token")
  const refreshToken = getToken("refresh_token")

  try {
    await fetch("http://localhost:8080/api/auth/logout", {
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
