'use client'
import { cn } from '@/lib/utils'

interface GameCellProps {
  value: number | null
  isInitial: boolean
  isSelected: boolean
  isError: boolean
  onClick: () => void
  position: [number, number]
}

export function GameCell({
  value,
  isInitial,
  isSelected,
  isError,
  onClick,
  position
}: GameCellProps) {
  const [row, col] = position
  const isLeftBorder = col % 3 === 0
  const isTopBorder = row % 3 === 0

  return (
    <button
      className={cn(
        'relative w-full aspect-square',
        'flex items-center justify-center',
        'text-xl md:text-2xl',
        'border-[0.5px] border-gray-400',
        isLeftBorder && 'border-l-2 border-l-gray-700',
        isTopBorder && 'border-t-2 border-t-gray-700',
        isInitial ? 'font-bold text-gray-700' : 'text-gray-600',
        isSelected && 'ring-2 ring-orange-400',
        isError && 'text-red-500',
        !value && 'text-muted-foreground'
      )}
      onClick={onClick}
    >
      {value || ''}
    </button>
  )
} 