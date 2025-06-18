export interface Game {
  id: string
  title: string
  description: string
  image: string
  link: string
}

export const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with modern design',
    image: '/images/games/snake.png',
    link: '/games/snake'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Classic tetris game with modern design',
    image: '/images/games/tetris.png',
    link: '/games/tetris'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Classic 2048 game with modern design',
    image: '/images/games/2048.png',
    link: '/games/2048'
  }
] 