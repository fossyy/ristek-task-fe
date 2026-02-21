"use client"

import { Link } from "react-router";
import { useLocation } from "react-router";
import {  LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/forms", label: "My Forms" },
]

export function Navbar() {
const { pathname } = useLocation();
const [mobileOpen, setMobileOpen] = useState(false);

const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            FormCraft
          </span>
        </Link>

        {!isAuthPage && (
          <>
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <span className="text-sm text-muted-foreground">
                bagas@example.com
              </span>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </>
        )}

        {isAuthPage && (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/login"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>

      {!isAuthPage && mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <span className="block px-3 py-1 text-sm text-muted-foreground">
              bagas@example.com
            </span>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
