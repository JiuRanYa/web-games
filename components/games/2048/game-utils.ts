export interface Tile {
  id: string;
  value: number;
  position: {
    row: number;
    col: number;
  };
  mergedFrom?: Tile[];
}

// 生成唯一ID的辅助函数
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 创建新的Tile对象
export function createTile(position: { row: number; col: number }, value: number): Tile {
  return {
    id: generateId(),
    value,
    position,
  }
}

// 初始化空网格
export function createEmptyGrid(): Tile[][] {
  return Array(4).fill(null).map(() => Array(4).fill(null))
}

// 在空位置随机生成数字（2或4）
export function generateNumber(grid: Tile[][]): Tile[][] {
  const position = getRandomEmptyPosition(grid)
  if (!position) return grid
  
  const newGrid = grid.map(row => [...row])
  newGrid[position.row][position.col] = createTile(
    position,
    Math.random() < 0.9 ? 2 : 4
  )
  
  return newGrid
}

// 初始化游戏
export function initializeGame(): Tile[][] {
  const grid = createEmptyGrid()
  
  // 添加两个初始数字
  const pos1 = getRandomEmptyPosition(grid)
  if (pos1) {
    grid[pos1.row][pos1.col] = createTile(pos1, Math.random() < 0.9 ? 2 : 4)
  }
  
  const pos2 = getRandomEmptyPosition(grid)
  if (pos2) {
    grid[pos2.row][pos2.col] = createTile(pos2, Math.random() < 0.9 ? 2 : 4)
  }
  
  return grid
}

function getRandomEmptyPosition(grid: Tile[][]): { row: number; col: number } | null {
  const emptyPositions: { row: number; col: number }[] = []
  
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (!tile) {
        emptyPositions.push({ row: i, col: j })
      }
    })
  })
  
  if (emptyPositions.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * emptyPositions.length)
  return emptyPositions[randomIndex]
}

// 压缩一行（去除空格）
function compress(row: Tile[]): Tile[] {
  return row.filter(cell => cell !== null)
}

// 合并相同的数字
function merge(row: Tile[]): [Tile[], number] {
  const compressed = compress(row)
  const merged: Tile[] = []
  let score = 0
  
  for (let i = 0; i < compressed.length; i++) {
    if (i < compressed.length - 1 && compressed[i].value === compressed[i + 1].value) {
      merged.push(createTile(
        compressed[i].position,
        compressed[i].value * 2
      ))
      merged[i].mergedFrom = [compressed[i], compressed[i + 1]]
      score += compressed[i].value * 2
      i++
    } else {
      merged.push(compressed[i])
    }
  }
  
  return [merged, score]
}

// 填充空格
function pad(row: Tile[], length: number): Tile[] {
  const padding = Array(length - row.length).fill(null)
  return [...row, ...padding]
}

// 移动和合并一行
export function moveRow(row: Tile[], direction: 'left' | 'right'): [Tile[], number] {
  const [merged, score] = merge(row)
  const padded = pad(merged, 4)
  return [direction === 'left' ? padded : padded.reverse(), score]
}

// 旋转矩阵（用于上下移动）
export function rotateGrid(grid: Tile[][]): Tile[][] {
  const newGrid: Tile[][] = Array(4).fill(null).map(() => Array(4).fill(null))
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][3 - i]
    }
  }
  return newGrid
}

// 检查是否可以移动
export function canMove(grid: Tile[][]): boolean {
  // 检查是否有空格
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!grid[i][j]) return true
    }
  }
  
  // 检查是否有相邻的相同数字
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j]?.value
      if (current) {
        if (
          (j < 3 && current === grid[i][j + 1]?.value) || // 右
          (i < 3 && current === grid[i + 1][j]?.value)    // 下
        ) {
          return true
        }
      }
    }
  }
  
  return false
}

// 检查是否胜利（是否有2048）
export function hasWon(grid: Tile[][]): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j]?.value === 2048) return true
    }
  }
  return false
}

// 执行移动操作
export function move(
  grid: Tile[][],
  direction: 'up' | 'down' | 'left' | 'right'
): { grid: Tile[][], score: number, moved: boolean } {
  let newGrid = grid.map(row => [...row])
  let totalScore = 0
  let moved = false
  
  const moveAndTrack = (row: Tile[], dir: 'left' | 'right'): Tile[] => {
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