'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GameControlsProps {
  onNumberClick: (number: number) => void
  onEraseClick: () => void
  possibleNumbers: number[]
  disabled: boolean
}

export function GameControls({
  onNumberClick,
  onEraseClick,
  possibleNumbers,
  disabled
}: GameControlsProps) {
  return (
    <div className="w-full max-w-[500px] min-w-[280px] mt-6 px-2">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            variant="outline"
            className={cn(
              'h-12 w-full text-lg font-medium bg-[#cdc1b4] border-0',
              'hover:bg-[#eee4da] transition-colors',
              possibleNumbers.includes(number) && 'ring-2 ring-primary'
            )}
            disabled={disabled || !possibleNumbers.includes(number)}
            onClick={() => onNumberClick(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          className={cn(
            'h-12 w-full text-lg font-medium bg-[#cdc1b4] border-0',
            'hover:bg-[#eee4da] transition-colors'
          )}
          disabled={disabled}
          onClick={onEraseClick}
        >
          ⌫
        </Button>
      </div>
    </div>
  )
} 