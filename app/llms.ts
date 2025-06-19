// 定义LLMs配置的类型
interface LLMsConfig {
  rules: {
    userAgent: string;
    allow: string[];
    disallow: string[];
    crawlDelay: number;
  };
  allowedPurposes: string[];
  disallowedPurposes: string[];
  license: {
    url: string;
    terms: string[];
  };
  lastUpdated: string;
  owner: {
    name: string;
    url: string;
    email: string;
  };
  preferredFormat: {
    type: string;
    encoding: string;
    language: string[];
  };
}

export default function llms(): LLMsConfig {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://games.tool.tokyo'

  return {
    rules: {
      // 通用AI爬虫规则
      userAgent: '*',
      allow: [
        '/', // 允许访问公开页面
        '/games/', // 允许访问游戏页面
        '/zh/', // 允许访问中文内容
        '/en/', // 允许访问英文内容
      ],
      disallow: [
        '/api/', // 禁止访问API
        '/admin/', // 禁止访问管理界面
        '/_next/', // 禁止访问Next.js内部文件
        '/_vercel/', // 禁止访问Vercel内部文件
        '/user/', // 禁止访问用户数据
      ],
      // 爬取频率限制
      crawlDelay: 10, // 每次请求间隔10秒
    },
    // 允许的使用场景
    allowedPurposes: [
      'research', // 允许研究用途
      'education', // 允许教育用途
      'search', // 允许搜索引擎
    ],
    // 不允许的使用场景
    disallowedPurposes: [
      'commercial-training', // 禁止商业模型训练
      'commercial-reproduction', // 禁止商业复制
      'disinformation', // 禁止用于虚假信息
      'harassment', // 禁止用于骚扰
    ],
    // 版权和许可信息
    license: {
      url: `${baseUrl}/license`,
      terms: [
        'attribution-required', // 需要注明来源
        'no-commercial-use', // 禁止商业使用
        'no-derivatives', // 禁止创建衍生作品
      ],
    },
    // 内容更新时间戳
    lastUpdated: new Date().toISOString(),
    // 站点所有者信息
    owner: {
      name: 'PlayHub',
      url: baseUrl,
      email: 'contact@games.tool.tokyo',
    },
    // 首选的内容格式
    preferredFormat: {
      type: 'html',
      encoding: 'utf-8',
      language: ['zh', 'en'],
    },
  }
} 