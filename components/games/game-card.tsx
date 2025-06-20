import Image from 'next/image'
import Link from 'next/link'
import { Game } from '@/config/games'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={game.link}
      className="group relative overflow-hidden rounded-lg border bg-background p-1.5 transition-colors hover:bg-accent sm:p-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-md sm:aspect-video">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-2 sm:p-4">
        <h2 className="text-base font-semibold sm:text-lg">{game.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{game.description}</p>
      </div>
    </Link>
  )
} 