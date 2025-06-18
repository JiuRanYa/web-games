export interface Tile {
  id: string;
  value: number;
  position: {
    row: number;
    col: number;
  };
  mergedFrom?: Tile[];
  isNew: boolean;
}

// 生成唯一ID的辅助函数
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 创建新的Tile对象
export function createTile(position: { row: number; col: number }, value: number, isNew: boolean = false): Tile {
  return {
    id: generateId(),
    value,
    position,
    isNew,
  }
}

// 初始化空网格
export function createEmptyGrid(): (Tile | null)[][] {
  return Array(4).fill(null).map(() => Array(4).fill(null))
}

// 在空位置随机生成数字（2或4）
export function generateNumber(grid: (Tile | null)[][]): (Tile | null)[][] {
  const position = getRandomEmptyPosition(grid)
  if (!position) return grid
  
  const newGrid = grid.map(row => [...row])
  newGrid[position.row][position.col] = createTile(
    position,
    Math.random() < 0.9 ? 2 : 4,
    true
  )
  
  return newGrid
}

// 初始化游戏
export function initializeGame(): (Tile | null)[][] {
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

function getRandomEmptyPosition(grid: (Tile | null)[][]): { row: number; col: number } | null {
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
export function canMove(grid: (Tile | null)[][]): boolean {
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
export function hasWon(grid: (Tile | null)[][]): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j]?.value === 2048) return true
    }
  }
  return false
}

// 执行移动操作
export function move(grid: (Tile | null)[][], direction: 'up' | 'down' | 'left' | 'right'): {
  grid: (Tile | null)[][];
  score: number;
  moved: boolean;
} {
  // 清除所有方块的isNew标记
  const gridWithoutNew = grid.map(row =>
    row.map(tile =>
      tile ? { ...tile, isNew: false } : null
    )
  )
  
  let totalScore = 0
  let moved = false
  const newGrid = gridWithoutNew.map(row => [...row])

  const moveLeft = () => {
    for (let i = 0; i < 4; i++) {
      let column = 0
      for (let j = 1; j < 4; j++) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = j
        
        while (k > column && !newGrid[i][k - 1]) {
          k--
        }
        
        if (k > column && newGrid[i][k - 1]?.value === tile.value) {
          const targetTile = newGrid[i][k - 1]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: i, col: k - 1 },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[i][k - 1] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          column = k
          moved = true
        } else if (k !== j) {
          tile.position = { row: i, col: k }
          newGrid[i][k] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveRight = () => {
    for (let i = 0; i < 4; i++) {
      let column = 3
      for (let j = 2; j >= 0; j--) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = j
        
        while (k < column && !newGrid[i][k + 1]) {
          k++
        }
        
        if (k < column && newGrid[i][k + 1]?.value === tile.value) {
          const targetTile = newGrid[i][k + 1]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: i, col: k + 1 },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[i][k + 1] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          column = k
          moved = true
        } else if (k !== j) {
          tile.position = { row: i, col: k }
          newGrid[i][k] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveUp = () => {
    for (let j = 0; j < 4; j++) {
      let row = 0
      for (let i = 1; i < 4; i++) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = i
        
        while (k > row && !newGrid[k - 1][j]) {
          k--
        }
        
        if (k > row && newGrid[k - 1][j]?.value === tile.value) {
          const targetTile = newGrid[k - 1][j]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: k - 1, col: j },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[k - 1][j] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          row = k
          moved = true
        } else if (k !== i) {
          tile.position = { row: k, col: j }
          newGrid[k][j] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  const moveDown = () => {
    for (let j = 0; j < 4; j++) {
      let row = 3
      for (let i = 2; i >= 0; i--) {
        const tile = newGrid[i][j]
        if (!tile) continue
        
        let k = i
        
        while (k < row && !newGrid[k + 1][j]) {
          k++
        }
        
        if (k < row && newGrid[k + 1][j]?.value === tile.value) {
          const targetTile = newGrid[k + 1][j]
          if (!targetTile) continue

          const mergedTile = createTile(
            { row: k + 1, col: j },
            tile.value * 2,
            false
          )
          mergedTile.mergedFrom = [targetTile, tile]
          
          newGrid[k + 1][j] = mergedTile
          newGrid[i][j] = null
          totalScore += mergedTile.value
          row = k
          moved = true
        } else if (k !== i) {
          tile.position = { row: k, col: j }
          newGrid[k][j] = tile
          newGrid[i][j] = null
          moved = true
        }
      }
    }
  }

  switch (direction) {
    case 'left':
      moveLeft()
      break
    case 'right':
      moveRight()
      break
    case 'up':
      moveUp()
      break
    case 'down':
      moveDown()
      break
  }

  return { grid: newGrid, score: totalScore, moved }
}