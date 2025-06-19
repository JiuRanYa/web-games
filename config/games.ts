export interface Game {
  id: string
  title: string
  description: string
  image: string
  link: string
}

export const games: Game[] = [
  {
    id: '2048',
    title: '2048',
    description: '一个简单而有趣的数字益智游戏，通过滑动合并相同的数字，尝试得到2048！',
    image: '/images/games/2048.jpg',
    link: '/games/2048'
  },
  {
    id: 'sudoku',
    title: '数独',
    description: '经典的数字推理游戏，在9x9的格子中填入1-9的数字，让每行、每列和每个3x3的方格都包含1-9的数字。',
    image: '/images/games/sudoku.jpg',
    link: '/games/sudoku'
  }
] 