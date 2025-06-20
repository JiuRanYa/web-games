import { GameBoard } from '@/components/games/snake/game-board'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('snake')

  return {
    title: t('title'),
    description: t('title'),
  }
}

export default function SnakePage() {
  return <GameBoard />
} 