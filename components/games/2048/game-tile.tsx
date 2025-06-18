'use client'
import { cn } from '@/lib/utils'

const tileColors: Record<number, string> = {
  2: 'bg-[#eee4da] text-[#776e65]',
  4: 'bg-[#ede0c8] text-[#776e65]',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-white',
  256: 'bg-[#edcc61] text-white',
  512: 'bg-[#edc850] text-white',
  1024: 'bg-[#edc53f] text-white',
  2048: 'bg-[#edc22e] text-white',
}

const tileFontSizes: Record<number, string> = {
  2: 'text-6xl',
  4: 'text-6xl',
  8: 'text-6xl',
  16: 'text-5xl',
  32: 'text-5xl',
  64: 'text-5xl',
  128: 'text-4xl',
  256: 'text-4xl',
  512: 'text-4xl',
  1024: 'text-3xl',
  2048: 'text-3xl',
}

interface GameTileProps {
  value: number
  className?: string
}

export function GameTile({ value, className }: GameTileProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center rounded-md font-bold',
        tileColors[value] || 'bg-[#3c3a32] text-white',
        tileFontSizes[value] || 'text-3xl',
        className
      )}
    >
      {value}
    </div>
  )
} 