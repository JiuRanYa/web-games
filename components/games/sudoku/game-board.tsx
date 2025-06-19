'use client'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GameCell } from './game-cell'
import { DifficultySettingsModal } from './difficulty-settings-modal'
import { Leaderboard } from './leaderboard'
import {
  Difficulty,
  generateGame,
  isGameComplete,
  isInitialNumber,
  isValid,
  addLeaderboardRecord,
  solveSudoku
} from './game-utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Board = (number | null)[][]
type Position = [number, number]

export function GameBoard() {
  const [board, setBoard] = useState<Board>([])
  const [initialBoard, setInitialBoard] = useState<Board>([])
  const [solution, setSolution] = useState<Board>([])
  const [isPreviewingSolution, setIsPreviewingSolution] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy')
  const [timeInSeconds, setTimeInSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [hintPosition, setHintPosition] = useState<Position | null>(null)

  // 初始化游戏
  const initGame = useCallback((difficulty: Difficulty) => {
    const newBoard = generateGame(difficulty)
    // 保存完整解法
    const solutionBoard = newBoard.map(row => [...row])
    solveSudoku(solutionBoard)
    setSolution(solutionBoard)
    
    setBoard(newBoard.map(row => [...row]))
    setInitialBoard(newBoard.map(row => [...row]))
    setSelectedPosition(null)
    setIsComplete(false)
    setIsSettingsOpen(false)
    setCurrentDifficulty(difficulty)
    setTimeInSeconds(0)
    setIsTimerRunning(true)
  }, [])

  // 计时器
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerRunning && !isComplete) {
      timer = setInterval(() => {
        setTimeInSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isTimerRunning, isComplete])

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
        setIsTimerRunning(false)
        // 添加到排行榜
        addLeaderboardRecord({
          difficulty: currentDifficulty,
          timeInSeconds,
          date: new Date().toISOString()
        })
      }
    }
  }, [board, selectedPosition, initialBoard, currentDifficulty, timeInSeconds])

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

  // 添加提示功能
  const handleHint = useCallback(() => {
    // 找到一个未填写且不是初始数字的格子
    const emptyPositions: Position[] = []
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null && !isInitialNumber(initialBoard, [rowIndex, colIndex])) {
          emptyPositions.push([rowIndex, colIndex])
        }
      })
    })

    if (emptyPositions.length > 0) {
      // 随机选择一个空格子
      const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
      const [row, col] = randomPosition
      
      // 填入正确答案
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = solution[row][col]
      setBoard(newBoard)
      
      // 设置提示动画位置
      setHintPosition(randomPosition)
      // 2秒后清除动画状态
      setTimeout(() => {
        setHintPosition(null)
      }, 2000)

      // 检查游戏是否完成
      if (isGameComplete(newBoard)) {
        setIsComplete(true)
        setIsTimerRunning(false)
        addLeaderboardRecord({
          difficulty: currentDifficulty,
          timeInSeconds,
          date: new Date().toISOString()
        })
      }
    }
  }, [board, initialBoard, solution, currentDifficulty, timeInSeconds])

  return (
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Sudoku Game</h1>
      
      <div className="flex flex-col items-center gap-4 relative">
        <div className="w-[500px] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(true)}
              className="bg-white hover:bg-gray-100"
            >
              新游戏
            </Button>
            <Button
              variant="outline"
              onMouseDown={() => setIsPreviewingSolution(true)}
              onMouseUp={() => setIsPreviewingSolution(false)}
              onMouseLeave={() => setIsPreviewingSolution(false)}
            >
              解法
            </Button>
            <Button
              variant="outline"
              onClick={handleHint}
              className="bg-white hover:bg-gray-100"
            >
              提示
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-mono text-lg">
              {Math.floor(timeInSeconds / 60)}:{(timeInSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="w-[500px] aspect-square">
          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
              <div className="text-4xl font-bold text-white">
                恭喜！你完成了数独！
              </div>
            </div>
          )}

          <div className="relative h-full w-full">
            <div className="grid grid-cols-9 h-full w-full">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <GameCell
                    key={`${rowIndex}-${colIndex}`}
                    value={cell}
                    previewValue={isPreviewingSolution ? solution[rowIndex][colIndex] : null}
                    isInitial={isInitialNumber(initialBoard, [rowIndex, colIndex])}
                    isSelected={
                      selectedPosition?.[0] === rowIndex &&
                      selectedPosition?.[1] === colIndex
                    }
                    isError={cell !== null && !isNumberValid(rowIndex, colIndex)}
                    isHint={
                      hintPosition?.[0] === rowIndex &&
                      hintPosition?.[1] === colIndex
                    }
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

        <div className="w-[500px]">
          <Accordion type="single" collapsible>
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
                  <li>使用数字键（1-9）输入数字</li>
                  <li>使用删除键或退格键清除数字</li>
                  <li>使用方向键在格子间移动</li>
                  <li>初始数字不可修改</li>
                  <li>错误的数字会显示为红色</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="absolute -right-80 top-16 w-[300px]">
          <Leaderboard />
        </div>
      </div>

      <DifficultySettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onStart={initGame}
      />
    </div>
  )
} 