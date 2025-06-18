'use client'
import { useState } from 'react'
import { GameTile } from './game-tile'
import { cn } from '@/lib/utils'

export interface GameBoardProps {
  className?: string
}

export function GameBoard({ className }: GameBoardProps) {
  const [grid] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)))

  return (
    <div className={cn('relative aspect-square w-full max-w-[500px] rounded-lg bg-[#bbada0] p-3', className)}>
      <div className="grid h-full w-full grid-cols-4 gap-3">
        {grid.map((row, i) =>
          row.map((value, j) => (
            <div
              key={`${i}-${j}`}
              className="relative aspect-square rounded-md bg-[#cdc1b4]"
            >
              {value > 0 && <GameTile value={value} />}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 