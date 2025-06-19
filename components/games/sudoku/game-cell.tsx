'use client'
import { cn } from '@/lib/utils'

interface GameCellProps {
  value: number | null
  isInitial: boolean
  isSelected: boolean
  isError: boolean
  onClick: () => void
}

export function GameCell({
  value,
  isInitial,
  isSelected,
  isError,
  onClick
}: GameCellProps) {
  return (
    <button
      className={cn(
        'relative aspect-square w-full',
        'rounded-md bg-[#cdc1b4] transition-colors',
        'flex items-center justify-center',
        'text-lg md:text-xl font-medium',
        isInitial && 'font-bold text-gray-700',
        isSelected && 'bg-[#eee4da]',
        isError && 'text-red-500',
        !value && 'text-muted-foreground'
      )}
      onClick={onClick}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        {value || ''}
      </span>
    </button>
  )
} 