'use client'
import { cn } from '@/lib/utils'

interface GameCellProps {
  value: number | null
  isInitial: boolean
  isSelected: boolean
  isError: boolean
  onClick: () => void
  position: [number, number]
  isFirstRow: boolean
  isLastRow: boolean
  isFirstCol: boolean
  isLastCol: boolean
}

export function GameCell({
  value,
  isInitial,
  isSelected,
  isError,
  onClick,
  position,
  isFirstRow,
  isLastRow,
  isFirstCol,
  isLastCol
}: GameCellProps) {
  const [row, col] = position
  const isRightBorder = (col + 1) % 3 === 0 && col < 8
  const isBottomBorder = (row + 1) % 3 === 0 && row < 8

  return (
    <button
      className={cn(
        'relative w-full aspect-square',
        'flex items-center justify-center',
        'text-xl md:text-2xl bg-[#f5e6d3]',
        'border-[0.5px] border-gray-400',
        // 3x3区域边框
        isRightBorder && 'border-r-2 border-r-gray-700',
        isBottomBorder && 'border-b-2 border-b-gray-700',
        // 外边框
        isFirstRow && 'border-t-2 border-t-gray-700',
        isLastRow && 'border-b-2 border-b-gray-700',
        isFirstCol && 'border-l-2 border-l-gray-700',
        isLastCol && 'border-r-2 border-r-gray-700',
        // 圆角
        isFirstRow && isFirstCol && 'rounded-tl-lg',
        isFirstRow && isLastCol && 'rounded-tr-lg',
        isLastRow && isFirstCol && 'rounded-bl-lg',
        isLastRow && isLastCol && 'rounded-br-lg',
        // 其他样式
        isInitial ? 'font-bold text-gray-700' : 'text-gray-600',
        isSelected && 'ring-2 ring-orange-400',
        isError && 'text-red-500'
      )}
      onClick={onClick}
    >
      {value || ''}
    </button>
  )
} 