import { GameBoard } from '@/components/games/2048/game-board'

export default function Game2048Page() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <GameBoard />
    </div>
  )
} 