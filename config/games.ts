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
  }
] 