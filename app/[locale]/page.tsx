import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { games } from '@/config/games'
import { GameCard } from '@/components/games/game-card'

export default async function IndexPage() {
  const t = await getTranslations('Index')

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {t('title')}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          {t('documentation')}
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline' })}
        >
          {t('github')}
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">{t('games.title')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  )
}
