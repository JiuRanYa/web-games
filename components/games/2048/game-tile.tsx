'use client'
import { cn } from '@/lib/utils'
import type { Tile } from './game-utils'

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
  2: 'text-4xl sm:text-5xl md:text-5xl lg:text-6xl',
  4: 'text-4xl sm:text-5xl md:text-5xl lg:text-6xl',
  8: 'text-4xl sm:text-5xl md:text-5xl lg:text-6xl',
  16: 'text-3xl sm:text-4xl md:text-4xl lg:text-5xl',
  32: 'text-3xl sm:text-4xl md:text-4xl lg:text-5xl',
  64: 'text-3xl sm:text-4xl md:text-4xl lg:text-5xl',
  128: 'text-2xl sm:text-3xl md:text-3xl lg:text-4xl',
  256: 'text-2xl sm:text-3xl md:text-3xl lg:text-4xl',
  512: 'text-2xl sm:text-3xl md:text-3xl lg:text-4xl',
  1024: 'text-2xl sm:text-2xl md:text-2xl lg:text-3xl',
  2048: 'text-2xl sm:text-2xl md:text-2xl lg:text-3xl',
}

interface GameTileProps {
  tile: Tile;
  className?: string;
}

export function GameTile({ tile, className }: GameTileProps) {
  const { value, position, isNew } = tile
  const tileSize = 23.4 // 与背景格子大小一致
  const margin = 0.8 // 与背景格子margin一致
  const style = {
    left: `${position.col * (tileSize + margin * 2) + margin}%`,
    top: `${position.row * (tileSize + margin * 2) + margin}%`,
    width: `${tileSize}%`,
    height: `${tileSize}%`,
    transform: `scale(${isNew ? 0 : 1})`,
    transition: 'all 100ms ease-in-out',
    zIndex: 2,
    animation: isNew ? 'tile-pop 200ms ease-in-out forwards' : undefined,
  }

  return (
    <div
      style={style}
      className={cn(
        'absolute flex items-center justify-center rounded-md font-bold',
        tileColors[value] || 'bg-[#3c3a32] text-white',
        tileFontSizes[value] || 'text-3xl',
        'transition-all duration-100 ease-in-out',
        className
      )}
    >
      <style jsx>{`
        @keyframes tile-pop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      {value}
    </div>
  )
} 