module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vuex',
      description: 'Centralized State Management for Vue.js'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vuex',
      description: 'Vue.js 的中心化状态管理方案'
    }
  },
  serviceWorker: true,
  theme: 'vue',
  themeConfig: {
    repo: 'vuejs/vuex',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Getting Started',
            link: '/getting-started'
          },
          {
            text: 'API Reference',
            link: '/api'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/installation',
          '/',
          '/getting-started',
          {
            title: 'Core Concepts',
            collapsable: false,
            children: [
              '/state',
              '/getters',
              '/mutations',
              '/actions',
              '/modules'
            ]
          },
          '/structure',
          '/plugins',
          '/strict',
          '/forms',
          '/testing',
          '/hot-reload'
        ]
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/getting-started'
          },
          {
            text: 'API 参考',
            link: '/zh/api'
          },
          {
            text: '更新记录',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/zh/installation',
          '/zh/',
          '/zh/getting-started',
          {
            title: '核心概念',
            collapsable: false,
            children: [
              '/zh/state',
              '/zh/getters',
              '/zh/mutations',
              '/zh/actions',
              '/zh/modules'
            ]
          },
          '/zh/structure',
          '/zh/plugins',
          '/zh/strict',
          '/zh/forms',
          '/zh/testing',
          '/zh/hot-reload'
        ]
      }
    }
  }
}
