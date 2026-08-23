"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // `resolvedTheme`/`theme` are undefined during SSR; sync render before
  // hydration completes would mismatch. Defer interactive state to a microtask.
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    void Promise.resolve().then(() => setMounted(true))
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  const themes = ["light", "dark", "system"] as const
  const currentIndex = themes.indexOf(theme as typeof themes[number])
  const nextIndex = (currentIndex + 1) % themes.length
  const nextTheme = themes[nextIndex]

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  }

  const labels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${labels[nextTheme]} mode`}
      title={`Current: ${labels[theme as keyof typeof labels]}. Click for ${labels[nextTheme]}.`}
    >
      {icons[theme as keyof typeof icons] ?? icons.system}
    </Button>
  )
}