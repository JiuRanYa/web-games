import { GameBoard } from '@/components/games/2048/game-board'

export const metadata = {
  title: '2048 游戏',
  description: '2048游戏，让你在摸鱼的同时也能享受游戏的乐趣',
  openGraph: {
    title: '2048',
    description: '2048游戏，让你在摸鱼的同时也能享受游戏的乐趣',
    images: ['/android-chrome-512x512.png'],
  },
}

export default function Game2048Page() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <GameBoard />
    </div>
  )
} 