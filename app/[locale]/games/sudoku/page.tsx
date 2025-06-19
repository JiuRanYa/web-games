import { GameBoard } from '@/components/games/sudoku/game-board'

export const metadata = {
  title: '数独游戏',
  description: '数独游戏，让你在摸鱼的同时也能享受游戏的乐趣',
  openGraph: {
    title: '数独游戏',
    description: '数独游戏，让你在摸鱼的同时也能享受游戏的乐趣',
    images: ['/android-chrome-512x512.png'],
  },
}

export default function SudokuPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <GameBoard />
    </div>
  )
} 