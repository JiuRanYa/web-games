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
      className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-colors hover:bg-accent"
    >
      <div className="relative aspect-video overflow-hidden rounded-md">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{game.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{game.description}</p>
      </div>
    </Link>
  )
} 