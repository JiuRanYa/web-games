import * as React from 'react'
import Link from 'next/link'

import { Icons } from '@/components/icons'
import { useTranslations } from 'next-intl'

export function MainNav() {
  const t = useTranslations('config')
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Icons.logo className="h-8 w-8" />
      <span className="inline-block font-bold">{t('name')}</span>
    </Link>
  )
}
