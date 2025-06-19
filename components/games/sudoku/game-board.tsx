'use client'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GameCell } from './game-cell'
import { DifficultySettingsModal } from './difficulty-settings-modal'
import {
  Difficulty,
  generateGame,
  isGameComplete,
  isInitialNumber,
  isValid
} from './game-utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

type Board = (number | null)[][]
type Position = [number, number]

export function GameBoard() {
  const [board, setBoard] = useState<Board>([])
  const [initialBoard, setInitialBoard] = useState<Board>([])
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  // 初始化游戏
  const initGame = useCallback((difficulty: Difficulty) => {
    const newBoard = generateGame(difficulty)
    setBoard(newBoard.map(row => [...row]))
    setInitialBoard(newBoard.map(row => [...row]))
    setSelectedPosition(null)
    setIsComplete(false)
    setIsSettingsOpen(false)
  }, [])

  // 处理数字输入
  const handleNumberInput = useCallback((number: number) => {
    if (!selectedPosition) return
    const [row, col] = selectedPosition
    
    if (!isInitialNumber(initialBoard, selectedPosition)) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = number
      setBoard(newBoard)

      // 检查游戏是否完成
      if (isGameComplete(newBoard)) {
        setIsComplete(true)
      }
    }
  }, [board, selectedPosition, initialBoard])

  // 处理删除
  const handleDelete = useCallback(() => {
    if (!selectedPosition) return
    const [row, col] = selectedPosition
    
    if (!isInitialNumber(initialBoard, selectedPosition)) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = null
      setBoard(newBoard)
    }
  }, [board, selectedPosition, initialBoard])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedPosition) return

    // 数字键1-9
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key))
    }
    // 数字小键盘1-9
    else if (e.code >= 'Numpad1' && e.code <= 'Numpad9') {
      handleNumberInput(parseInt(e.code.replace('Numpad', '')))
    }
    // 删除键和退格键
    else if (e.key === 'Delete' || e.key === 'Backspace') {
      handleDelete()
    }
    // 方向键
    else if (e.key.startsWith('Arrow')) {
      e.preventDefault()
      const [currentRow, currentCol] = selectedPosition
      let newRow = currentRow
      let newCol = currentCol

      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, currentRow - 1)
          break
        case 'ArrowDown':
          newRow = Math.min(8, currentRow + 1)
          break
        case 'ArrowLeft':
          newCol = Math.max(0, currentCol - 1)
          break
        case 'ArrowRight':
          newCol = Math.min(8, currentCol + 1)
          break
      }

      setSelectedPosition([newRow, newCol])
    }
  }, [selectedPosition, handleNumberInput, handleDelete])

  // 添加键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 检查数字是否有效
  const isNumberValid = useCallback((row: number, col: number): boolean => {
    const value = board[row][col]
    if (value === null) return true
    const originalValue = board[row][col]
    board[row][col] = null
    const valid = isValid(board, [row, col], value)
    board[row][col] = originalValue
    return valid
  }, [board])

  return (
    <div className="flex flex-col items-center gap-4 w-full p-4 bg-[#f5e6d3]">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Sudoku Game</h1>
      
      <div className="w-full max-w-[500px] min-w-[280px] flex items-center justify-between px-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white hover:bg-gray-100"
        >
          新游戏
        </Button>
      </div>

      <div 
        className={cn(
          'w-full max-w-[500px] min-w-[280px] aspect-square',
          'rounded-lg overflow-hidden',
          'shadow-lg'
        )}
      >
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
            <div className="text-4xl font-bold text-white">
              恭喜！你完成了数独！
            </div>
          </div>
        )}

        <div className="relative h-full w-full">
          <div className="grid grid-cols-9 h-full w-full rounded-lg">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <GameCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  isInitial={isInitialNumber(initialBoard, [rowIndex, colIndex])}
                  isSelected={
                    selectedPosition?.[0] === rowIndex &&
                    selectedPosition?.[1] === colIndex
                  }
                  isError={cell !== null && !isNumberValid(rowIndex, colIndex)}
                  onClick={() => setSelectedPosition([rowIndex, colIndex])}
                  position={[rowIndex, colIndex]}
                  isFirstRow={rowIndex === 0}
                  isLastRow={rowIndex === 8}
                  isFirstCol={colIndex === 0}
                  isLastCol={colIndex === 8}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[500px] min-w-[280px] mt-8">
        <Accordion type="single" collapsible className="bg-white rounded-lg">
          <AccordionItem value="rules">
            <AccordionTrigger>游戏规则</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>在9x9的格子中填入数字1-9</li>
                <li>每行、每列和每个3x3的方格中的数字不能重复</li>
                <li>部分格子已经填入了初始数字（加粗显示）</li>
                <li>你需要根据这些初始数字推理出其他格子的数字</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="controls">
            <AccordionTrigger>操作说明</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>点击格子选中它</li>
                <li>使用数字键（1-9）或数字小键盘输入数字</li>
                <li>使用退格键或删除键清除数字</li>
                <li>使用方向键在格子间移动</li>
                <li>红色数字表示与规则冲突</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tips">
            <AccordionTrigger>游戏技巧</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>从已知数字最多的行、列或3x3方格开始</li>
                <li>找出某个数字在特定区域只能填在一个位置</li>
                <li>排除法：先标记格子不能填入的数字</li>
                <li>多种解题技巧：唯一候选数、隐性单数等</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <DifficultySettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onDifficultySelect={initGame}
      />
    </div>
  )
} 