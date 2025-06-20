import { GameBoard } from '@/components/games/minesweeper/game-board'

export const metadata = {
  title: '扫雷',
  description: '经典扫雷游戏，考验你的逻辑思维和记忆力',
  openGraph: {
    title: '扫雷',
    description: '经典扫雷游戏，考验你的逻辑思维和记忆力',
    images: ['/android-chrome-512x512.png'],
  },
}

export default function MinesweeperPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <GameBoard />
    </div>
  )
} 