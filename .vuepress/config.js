module.exports = {
  title: '学习经验分享',
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
    }
  }
}