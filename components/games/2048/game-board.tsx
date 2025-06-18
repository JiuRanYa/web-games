'use client'
import { useState, useEffect, useCallback } from 'react'
import { GameTile } from './game-tile'
import { cn } from '@/lib/utils'
import { initializeGame, move, generateNumber, canMove, hasWon, createEmptyGrid, Tile } from './game-utils'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface GameBoardProps {
  className?: string
}

export function GameBoard({ className }: GameBoardProps) {
  const [grid, setGrid] = useState<(Tile | null)[][]>(createEmptyGrid())
  const [score, setScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [won, setWon] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // 在客户端初始化游戏
  useEffect(() => {
    if (!isInitialized) {
      setGrid(initializeGame())
      setIsInitialized(true)
    }
  }, [isInitialized])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || won || !isInitialized) return

    const { grid: newGrid, score: moveScore, moved } = move(grid, direction)
    
    if (moved) {
      const gridWithNewNumber = generateNumber(newGrid)
      setGrid(gridWithNewNumber)
      setScore(prev => prev + moveScore)
      
      // 检查游戏状态
      if (hasWon(gridWithNewNumber)) {
        setWon(true)
      } else if (!canMove(gridWithNewNumber)) {
        setGameOver(true)
      }
    }
  }, [grid, gameOver, won, isInitialized])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyS: 'down',
      KeyA: 'left',
      KeyD: 'right',
    }

    const direction = keyMap[event.code]
    if (direction) {
      event.preventDefault()
      handleMove(direction)
    }
  }, [handleMove])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const resetGame = useCallback(() => {
    const newGrid = initializeGame()
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setWon(false)
    setIsInitialized(true)
  }, [])

  // 获取所有非空方块
  const tiles = grid.flatMap((row, i) =>
    row.map((tile, j) => tile ? { ...tile, position: { row: i, col: j } } : null)
  ).filter((tile): tile is Tile => tile !== null)

  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">2048</h1>
      <div className="w-full max-w-[500px] min-w-[280px] flex items-center justify-between px-2">
        <div className="text-2xl font-bold">分数: {score}</div>
        <Button onClick={resetGame}>重新开始</Button>
      </div>
      
      <div className={cn(
        'relative w-full max-w-[500px] min-w-[280px] aspect-square',
        'rounded-lg bg-[#bbada0] p-3 md:p-4',
        className
      )}>
        {(gameOver || won) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
            <div className="text-4xl font-bold text-white">
              {won ? '你赢了！' : '游戏结束！'}
            </div>
          </div>
        )}
        <div className="relative h-full w-full">
          {/* 背景格子 */}
          <div className="grid h-full w-full grid-cols-4 gap-2 md:gap-3">
            {Array(16).fill(null).map((_, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-md bg-[#cdc1b4]"
              />
            ))}
          </div>
          {/* 数字方块 */}
          {tiles.map(tile => (
            <GameTile
              key={tile.id}
              tile={tile}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[500px] min-w-[280px] mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="rules">
            <AccordionTrigger>游戏规则是什么？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>在 4x4 的网格上移动数字方块</li>
                <li>相同数字的方块相撞时会合并成为它们的和</li>
                <li>每次移动后，会在空位置随机生成一个 2 或 4</li>
                <li>当出现 2048 方块时获胜</li>
                <li>当无法继续移动时游戏结束</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="controls">
            <AccordionTrigger>如何操作游戏？</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">你可以使用以下方式移动方块：</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>方向键：↑ ↓ ← →</li>
                <li>WASD 键：W（上）S（下）A（左）D（右）</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scoring">
            <AccordionTrigger>如何计算分数？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>每次方块合并时，得分等于合并后的数字</li>
                <li>例如：2+2=4，得分 4 分</li>
                <li>4+4=8，得分 8 分</li>
                <li>分数会持续累加，直到游戏结束</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="strategy">
            <AccordionTrigger>有什么游戏技巧？</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>尽量保持最大数字在角落</li>
                <li>保持大数字相邻，便于合并</li>
                <li>避免小数字分散在棋盘各处</li>
                <li>在必要时保留一个方向作为紧急出口</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
} 