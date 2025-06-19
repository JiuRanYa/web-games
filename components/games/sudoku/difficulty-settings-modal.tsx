'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Difficulty } from './game-utils'

interface DifficultySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDifficultySelect: (difficulty: Difficulty) => void
}

export function DifficultySettingsModal({
  open,
  onOpenChange,
  onDifficultySelect
}: DifficultySettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择难度</DialogTitle>
          <DialogDescription>
            选择一个难度开始新游戏。难度越高，初始数字越少。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => onDifficultySelect('easy')}
          >
            简单
          </Button>
          <Button
            variant="outline"
            onClick={() => onDifficultySelect('medium')}
          >
            中等
          </Button>
          <Button
            variant="outline"
            onClick={() => onDifficultySelect('hard')}
          >
            困难
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 