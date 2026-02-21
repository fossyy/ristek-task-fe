import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router"
import { type User, getUser } from "@/lib/auth"
import { getUserAsync, logout as logoutUser } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function init() {
      let currentUser = getUser()
      if (!currentUser) {
        currentUser = await getUserAsync()
      }
      setUser(currentUser)
      setLoading(false)
    }
    init()
  }, [])

  async function logout() {
    await logoutUser()
    setUser(null)
    navigate("/login")
  }

  function refreshUser() {
    const currentUser = getUser()
    setUser(currentUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
