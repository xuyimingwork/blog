module.exports = {
  title: '会意',
  description: '每有会意 便欣然忘食',
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#fff' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['link', { rel: 'apple-touch-icon', href: '/icon-apple-touch.png' }],
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