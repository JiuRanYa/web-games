// 初始化空网格
export function createEmptyGrid(): number[][] {
  return Array(4).fill(null).map(() => Array(4).fill(0))
}

// 在空位置随机生成数字（2或4）
export function generateNumber(grid: number[][]): number[][] {
  const emptyPositions: [number, number][] = []
  
  // 找出所有空位置
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyPositions.push([i, j])
      }
    }
  }
  
  if (emptyPositions.length === 0) return grid
  
  // 随机选择一个空位置
  const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
  // 90%概率生成2，10%概率生成4
  const newValue = Math.random() < 0.9 ? 2 : 4
  
  const newGrid = grid.map(row => [...row])
  newGrid[row][col] = newValue
  
  return newGrid
}

// 初始化游戏
export function initializeGame(): number[][] {
  let grid = createEmptyGrid()
  // 生成两个初始数字
  grid = generateNumber(grid)
  grid = generateNumber(grid)
  return grid
}

// 压缩一行（去除空格）
function compress(row: number[]): number[] {
  return row.filter(cell => cell !== 0)
}

// 合并相同的数字
function merge(row: number[]): [number[], number] {
  const compressed = compress(row)
  const merged: number[] = []
  let score = 0
  
  for (let i = 0; i < compressed.length; i++) {
    if (i < compressed.length - 1 && compressed[i] === compressed[i + 1]) {
      merged.push(compressed[i] * 2)
      score += compressed[i] * 2
      i++
    } else {
      merged.push(compressed[i])
    }
  }
  
  return [merged, score]
}

// 填充空格
function pad(row: number[], length: number): number[] {
  const padding = Array(length - row.length).fill(0)
  return [...row, ...padding]
}

// 移动和合并一行
export function moveRow(row: number[], direction: 'left' | 'right'): [number[], number] {
  const [merged, score] = merge(row)
  const padded = pad(merged, 4)
  return [direction === 'left' ? padded : padded.reverse(), score]
}

// 旋转矩阵（用于上下移动）
export function rotateGrid(grid: number[][]): number[][] {
  const newGrid: number[][] = Array(4).fill(null).map(() => Array(4).fill(0))
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][3 - i]
    }
  }
  return newGrid
}

// 检查是否可以移动
export function canMove(grid: number[][]): boolean {
  // 检查是否有空格
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return true
    }
  }
  
  // 检查是否有相邻的相同数字
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j]
      if (
        (j < 3 && current === grid[i][j + 1]) || // 右
        (i < 3 && current === grid[i + 1][j])    // 下
      ) {
        return true
      }
    }
  }
  
  return false
}

// 检查是否胜利（是否有2048）
export function hasWon(grid: number[][]): boolean {
  return grid.some(row => row.some(cell => cell === 2048))
}

// 执行移动操作
export function move(
  grid: number[][],
  direction: 'up' | 'down' | 'left' | 'right'
): { grid: number[][], score: number, moved: boolean } {
  let newGrid = grid.map(row => [...row])
  let totalScore = 0
  let moved = false
  
  const moveAndTrack = (row: number[], dir: 'left' | 'right'): number[] => {
    const [newRow, score] = moveRow(row, dir)
    totalScore += score
    if (JSON.stringify(row) !== JSON.stringify(newRow)) {
      moved = true
    }
    return newRow
  }
  
  switch (direction) {
    case 'left':
      newGrid = newGrid.map(row => moveAndTrack(row, 'left'))
      break
    case 'right':
      newGrid = newGrid.map(row => moveAndTrack([...row].reverse(), 'left')).map(row => [...row].reverse())
      break
    case 'up':
      newGrid = rotateGrid(newGrid)
      newGrid = newGrid.map(row => moveAndTrack(row, 'left'))
      newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)))
      break
    case 'down':
      newGrid = rotateGrid(rotateGrid(rotateGrid(newGrid)))
      newGrid = newGrid.map(row => moveAndTrack(row, 'left'))
      newGrid = rotateGrid(newGrid)
      break
  }
  
  return { grid: newGrid, score: totalScore, moved }
}