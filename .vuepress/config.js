module.exports = {
  title: '会意',
  description: '每有会意 便欣然忘食',
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#fff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['link', { rel: 'apple-touch-icon', sizes: '58x58', href: '/android-touch-icon.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-touch-icon-76x76.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon-120x120.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' }],
  ],
  theme: '@vuepress/theme-blog',
  themeConfig: {
    dateFormat: 'YYYY-MM-DD',
    nav: [
      {
        text: '文章',
        link: '/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
    ],
    directories:[
      {
        id: 'post',
        dirname: 'posts',
        path: '/',
        itemPermalink: '/post/:year-:month-:day/:slug',
      }
    ],
    footer: {
      contact: [
        { type: 'github', link: 'https://github.com/xuyimingwork' },
        { type: 'mail', link: 'mailto:xuyimingwork@foxmail.com' },
      ],
      copyright: [
        {
          text: '闽ICP备20001517号-1',
          link: 'http://www.beian.miit.gov.cn',
        },
      ]
    },
    pwa: true
  },
  evergreen: true,
  markdown: {
    lineNumbers: true
  }
}