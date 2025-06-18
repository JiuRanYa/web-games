'use client'
import { useState, useEffect, useCallback } from 'react'
import { GameTile } from './game-tile'
import { cn } from '@/lib/utils'
import { initializeGame, move, generateNumber, canMove, hasWon, createEmptyGrid } from './game-utils'

export interface GameBoardProps {
  className?: string
}

export function GameBoard({ className }: GameBoardProps) {
  const [grid, setGrid] = useState<number[][]>(createEmptyGrid())
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

  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">2048</h1>
      <div className="w-full max-w-[500px] min-w-[280px] flex items-center justify-between px-2">
        <div className="text-2xl font-bold">分数: {score}</div>
        <button
          onClick={resetGame}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          重新开始
        </button>
      </div>
      
      <div className={cn(
        'relative w-full max-w-[500px] min-w-[280px] aspect-square',
        'rounded-lg bg-[#bbada0] p-3 md:p-4',
        className
      )}>
        {(gameOver || won) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-4xl font-bold text-white">
              {won ? '你赢了！' : '游戏结束！'}
            </div>
          </div>
        )}
        <div className="grid h-full w-full grid-cols-4 gap-2 md:gap-3">
          {grid.map((row, i) =>
            row.map((value, j) => (
              <div
                key={`${i}-${j}`}
                className="relative aspect-square rounded-md bg-[#cdc1b4]"
              >
                {value > 0 && <GameTile value={value} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 