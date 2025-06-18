import { GameBoard } from '@/components/games/2048/game-board'

export default function Game2048Page() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <h1 className="mb-8 text-4xl font-bold">2048</h1>
      <GameBoard />
    </div>
  )
} 