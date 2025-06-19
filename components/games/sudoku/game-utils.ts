type Board = (number | null)[][]
type Position = [number, number]

export type Difficulty = 'easy' | 'medium' | 'hard'

const BOARD_SIZE = 9
const GRID_SIZE = 3

// 检查数字在指定位置是否有效
export function isValid(board: Board, pos: Position, num: number): boolean {
  const [row, col] = pos

  // 检查行
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[row][x] === num) return false
  }

  // 检查列
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[x][col] === num) return false
  }

  // 检查3x3方格
  const boxRow = Math.floor(row / GRID_SIZE) * GRID_SIZE
  const boxCol = Math.floor(col / GRID_SIZE) * GRID_SIZE
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false
    }
  }

  return true
}

// 找到空位置
function findEmpty(board: Board): Position | null {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) {
        return [i, j]
      }
    }
  }
  return null
}

// 解数独
function solveSudoku(board: Board): boolean {
  const empty = findEmpty(board)
  if (!empty) return true

  const [row, col] = empty
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, [row, col], num)) {
      board[row][col] = num
      if (solveSudoku(board)) return true
      board[row][col] = null
    }
  }

  return false
}

// 生成完整的数独解决方案
function generateSolution(): Board {
  const board: Board = Array(BOARD_SIZE).fill(null)
    .map(() => Array(BOARD_SIZE).fill(null))

  // 随机填充一些初始数字
  for (let i = 0; i < 3; i++) {
    const num = Math.floor(Math.random() * 9) + 1
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (isValid(board, [row, col], num)) {
      board[row][col] = num
    }
  }

  solveSudoku(board)
  return board
}

// 根据难度移除数字
function removeNumbers(board: Board, difficulty: Difficulty): Board {
  const numbersToRemove = {
    easy: 30,
    medium: 40,
    hard: 50
  }

  const result = board.map(row => [...row])
  const positions = Array(BOARD_SIZE * BOARD_SIZE).fill(null)
    .map((_, i) => [Math.floor(i / BOARD_SIZE), i % BOARD_SIZE] as Position)
    .sort(() => Math.random() - 0.5)

  for (let i = 0; i < numbersToRemove[difficulty]; i++) {
    const [row, col] = positions[i]
    result[row][col] = null
  }

  return result
}

// 生成新游戏
export function generateGame(difficulty: Difficulty): Board {
  const solution = generateSolution()
  return removeNumbers(solution, difficulty)
}

// 验证当前游戏状态是否完成
export function isGameComplete(board: Board): boolean {
  // 检查是否有空格子
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) return false
    }
  }

  // 检查每行
  for (let row = 0; row < BOARD_SIZE; row++) {
    const nums = new Set(board[row])
    if (nums.size !== BOARD_SIZE) return false
  }

  // 检查每列
  for (let col = 0; col < BOARD_SIZE; col++) {
    const nums = new Set(board.map(row => row[col]))
    if (nums.size !== BOARD_SIZE) return false
  }

  // 检查每个3x3方格
  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += GRID_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += GRID_SIZE) {
      const nums = new Set()
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          nums.add(board[boxRow + i][boxCol + j])
        }
      }
      if (nums.size !== BOARD_SIZE) return false
    }
  }

  return true
}

// 检查是否是初始数字（不可修改）
export function isInitialNumber(board: Board, pos: Position): boolean {
  const [row, col] = pos
  return board[row][col] !== null
}

// 获取可能的数字列表
export function getPossibleNumbers(board: Board, pos: Position): number[] {
  const possible = []
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, pos, num)) {
      possible.push(num)
    }
  }
  return possible
}

// 排行榜记录类型
export interface LeaderboardRecord {
  difficulty: Difficulty
  timeInSeconds: number
  date: string
}

// 获取排行榜数据
export function getLeaderboard(): LeaderboardRecord[] {
  const data = localStorage.getItem('sudoku-leaderboard')
  return data ? JSON.parse(data) : []
}

// 保存排行榜数据
export function saveLeaderboard(records: LeaderboardRecord[]) {
  localStorage.setItem('sudoku-leaderboard', JSON.stringify(records))
}

// 添加新记录到排行榜
export function addLeaderboardRecord(record: LeaderboardRecord) {
  const records = getLeaderboard()
  records.push(record)
  // 按时间升序排序
  records.sort((a, b) => a.timeInSeconds - b.timeInSeconds)
  // 只保留前10名
  const topRecords = records.slice(0, 10)
  saveLeaderboard(topRecords)
  return topRecords
} 