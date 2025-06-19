import { GameBoard } from '@/components/games/sudoku/game-board'

export default function SudokuPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <GameBoard />
    </div>
  )
} 