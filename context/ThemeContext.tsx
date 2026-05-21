'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const VALID_THEMES: Theme[] = ['light', 'dark']
const STORAGE_KEY = 'chicoine-theme'

// Sentinel used before hydration so we never render with a wrong default.
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start as undefined so we can detect "not yet hydrated" and avoid a flash.
  const [theme, setTheme] = useState<Theme | undefined>(undefined)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (VALID_THEMES as string[]).includes(saved)) {
      const validSaved = saved as Theme
      setTheme(validSaved)
      document.documentElement.classList.toggle('dark', validSaved === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial: Theme = prefersDark ? 'dark' : 'light'
      setTheme(initial)
      document.documentElement.classList.toggle('dark', initial === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  // Suppress rendering until the real theme is known to avoid a flash of the
  // wrong theme on first paint.
  if (theme === undefined) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
