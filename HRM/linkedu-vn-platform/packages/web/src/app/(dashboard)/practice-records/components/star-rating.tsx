"use client"
import { Star } from "lucide-react"

export function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted-foreground">—</span>
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
      <span className="ml-1.5 text-xs font-medium text-muted-foreground">{rating}/5</span>
    </span>
  )
}