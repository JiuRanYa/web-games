import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GameConfig, DEFAULT_GAME_CONFIG } from './game-utils'
import { useTranslations } from 'next-intl'
import { ChangeEvent } from 'react'

interface DifficultySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentConfig: GameConfig
  onConfigChange: (config: GameConfig) => void
}

const configSchema = z.object({
  FOUR_PROBABILITY: z.number().min(0).max(1),
  INITIAL_TILES: z.number().min(1).max(6),
  GRID_SIZE: z.number().min(3).max(8),
  WIN_VALUE: z.number().min(128).max(16384)
})

export function DifficultySettingsModal({
  open,
  onOpenChange,
  currentConfig,
  onConfigChange
}: DifficultySettingsModalProps) {
  const t = useTranslations('2048')
  const form = useForm<GameConfig>({
    resolver: zodResolver(configSchema),
    defaultValues: currentConfig,
  })

  const onSubmit = (values: GameConfig) => {
    onConfigChange(values)
    onOpenChange(false)
  }

  const resetToDefault = () => {
    form.reset(DEFAULT_GAME_CONFIG)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="FOUR_PROBABILITY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.fourProbability')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.fourProbabilityDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="INITIAL_TILES"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.initialTiles')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.initialTilesDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="GRID_SIZE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.gridSize')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="3"
                      max="8"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.gridSizeDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="WIN_VALUE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.winValue')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="128"
                      max="16384"
                      step="128"
                      {...field}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('settings.winValueDesc')}
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={resetToDefault}>
                {t('settings.resetToDefault')}
              </Button>
              <Button type="submit">{t('settings.save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 