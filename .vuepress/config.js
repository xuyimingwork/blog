module.exports = {
  title: '会意',
  description: '每有会意 便欣然忘食',
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
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
    globalPagination: {
      prevText:'上一页',
      nextText:'下一页',
      lengthPerPage: 5
    },
    footer: {
      contact: [
        { type: 'github', link: 'https://github.com/xuyimingwork' },
        { type: 'mail', link: 'mailto:xuyimingwork@foxmail.com' },
      ],
      copyright: [
        {
          text: '闽公网安备 35030202000432号',
          link: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35030202000432',
        },
        {
          text: '闽ICP备20001517号-1',
          link: 'http://www.beian.miit.gov.cn',
        },
      ]
    },
  },
  evergreen: true,
  markdown: {
    lineNumbers: true
  },
}