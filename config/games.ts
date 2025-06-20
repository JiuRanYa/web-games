export interface Game {
  id: string
  title: string
  image: string
  link: string
}

export const games: Game[] = [
  {
    id: '2048',
    title: '2048',
    image: '/images/games/2048.jpg',
    link: '/games/2048'
  },
  {
    id: 'sudoku',
    title: '数独',
    image: '/images/games/sudoku.jpg',
    link: '/games/sudoku'
  },
  {
    id: 'minesweeper',
    title: '扫雷',
    image: '/images/games/minesweeper.jpg',
    link: '/games/minesweeper'
  }
] 