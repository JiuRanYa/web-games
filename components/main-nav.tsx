import * as React from 'react'
import Link from 'next/link'

import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { useTranslations } from 'next-intl'

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const t = useTranslations('config')
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-8 w-8" />
        <span className="inline-block font-bold">{t('name')}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
