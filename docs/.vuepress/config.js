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
    },
    '/ja/': {
      lang: 'ja',
      title: 'Vuex',
      description: 'Vue.js のための集中状態管理'
    },
    '/ru/': {
      lang: 'ru',
      title: 'Vuex',
      description: 'Централизованное управление состоянием для Vue.js'
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
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'GitHub 上でこのページを編集する',
        nav: [{
            text: 'ガイド',
            link: '/ja/getting-started'
          },
          {
            text: 'API リファレンス',
            link: '/ja/api'
          },
          {
            text: 'リリースノート',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/ja/installation',
          '/ja/',
          '/ja/getting-started',
          {
            title: 'コアコンセプト',
            collapsable: false,
            children: [
              '/ja/state',
              '/ja/getters',
              '/ja/mutations',
              '/ja/actions',
              '/ja/modules'
            ]
          },
          '/ja/structure',
          '/ja/plugins',
          '/ja/strict',
          '/ja/forms',
          '/ja/testing',
          '/ja/hot-reload'
        ]
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Languages',
        editLinkText: 'Изменить эту страницу на GitHub',
        nav: [
          {
            text: 'Введение',
            link: '/ru/getting-started'
          },
          {
            text: 'Справочник API',
            link: '/ru/api'
          },
          {
            text: 'История изменений',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/ru/installation',
          '/ru/',
          '/ru/getting-started',
          {
            title: 'Основные понятия',
            collapsable: false,
            children: [
              '/ru/state',
              '/ru/getters',
              '/ru/mutations',
              '/ru/actions',
              '/ru/modules'
            ]
          },
          '/ru/structure',
          '/ru/plugins',
          '/ru/strict',
          '/ru/forms',
          '/ru/testing',
          '/ru/hot-reload'
        ]
      }
    }
  }
}
