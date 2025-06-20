import { GameBoard } from '@/components/games/minesweeper/game-board'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('minesweeper.metadata')
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['/images/games/minesweeper.jpg'],
    },
  }
}

export default function MinesweeperPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">扫雷</h1>
      <GameBoard />
    </div>
  )
} 