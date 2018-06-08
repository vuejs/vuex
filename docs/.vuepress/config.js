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
    },
    '/kr/': {
      lang: 'kr',
      title: 'Vuex',
      description: 'Vue.js의 중앙 상태 관리'
    },
    '/ptbr/': {
      lang: 'pt-BR',
      title: 'Vuex',
      description: 'Gerenciamento de Estado Centralizado para Vue.js'
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
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/installation',
          '/',
          '/guide/',
          {
            title: 'Core Concepts',
            collapsable: false,
            children: [
              '/guide/state',
              '/guide/getters',
              '/guide/mutations',
              '/guide/actions',
              '/guide/modules'
            ]
          },
          '/guide/structure',
          '/guide/plugins',
          '/guide/strict',
          '/guide/forms',
          '/guide/testing',
          '/guide/hot-reload'
        ]
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: 'API 参考',
            link: '/zh/api/'
          },
          {
            text: '更新记录',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/zh/installation',
          '/zh/',
          '/zh/guide/',
          {
            title: '核心概念',
            collapsable: false,
            children: [
              '/zh/guide/state',
              '/zh/guide/getters',
              '/zh/guide/mutations',
              '/zh/guide/actions',
              '/zh/guide/modules'
            ]
          },
          '/zh/guide/structure',
          '/zh/guide/plugins',
          '/zh/guide/strict',
          '/zh/guide/forms',
          '/zh/guide/testing',
          '/zh/guide/hot-reload'
        ]
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'GitHub 上でこのページを編集する',
        nav: [{
            text: 'ガイド',
            link: '/ja/guide/'
          },
          {
            text: 'API リファレンス',
            link: '/ja/api/'
          },
          {
            text: 'リリースノート',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/ja/installation',
          '/ja/',
          '/ja/guide/',
          {
            title: 'コアコンセプト',
            collapsable: false,
            children: [
              '/ja/guide/state',
              '/ja/guide/getters',
              '/ja/guide/mutations',
              '/ja/guide/actions',
              '/ja/guide/modules'
            ]
          },
          '/ja/guide/structure',
          '/ja/guide/plugins',
          '/ja/guide/strict',
          '/ja/guide/forms',
          '/ja/guide/testing',
          '/ja/guide/hot-reload'
        ]
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Languages',
        editLinkText: 'Изменить эту страницу на GitHub',
        nav: [
          {
            text: 'Руководство',
            link: '/ru/guide/'
          },
          {
            text: 'Справочник API',
            link: '/ru/api/'
          },
          {
            text: 'История изменений',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/ru/installation',
          '/ru/',
          '/ru/guide/',
          {
            title: 'Основные понятия',
            collapsable: false,
            children: [
              '/ru/guide/state',
              '/ru/guide/getters',
              '/ru/guide/mutations',
              '/ru/guide/actions',
              '/ru/guide/modules'
            ]
          },
          '/ru/guide/structure',
          '/ru/guide/plugins',
          '/ru/guide/strict',
          '/ru/guide/forms',
          '/ru/guide/testing',
          '/ru/guide/hot-reload'
        ]
      },
      '/kr/': {
        label: '한국어',
        selectText: '언어 변경',
        editLinkText: 'GitHub에서 이 페이지 수정',
        nav: [{
            text: '가이드',
            link: '/kr/guide/'
          },
          {
            text: 'API 레퍼런스',
            link: '/kr/api/'
          },
          {
            text: '릴리즈 노트',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/kr/installation',
          '/kr/',
          '/kr/guide/',
          {
            title: '핵심 컨셉',
            collapsable: false,
            children: [
              '/kr/guide/state',
              '/kr/guide/getters',
              '/kr/guide/mutations',
              '/kr/guide/actions',
              '/kr/guide/modules'
            ]
          },
          '/kr/guide/structure',
          '/kr/guide/plugins',
          '/kr/guide/strict',
          '/kr/guide/forms',
          '/kr/guide/testing',
          '/kr/guide/hot-reload'
        ]
      },
      '/ptbr/': {
        label: 'Português',
        selectText: 'Idiomas',
        editLinkText: 'Edite esta página no GitHub',
        nav: [
          {
            text: 'Guia',
            link: '/ptbr/guide/'
          },
          {
            text: 'Referência da API',
            link: '/ptbr/api/'
          },
          {
            text: 'Notas da Versão',
            link: 'https://github.com/vuejs/vuex/releases'
          }
        ],
        sidebar: [
          '/ptbr/installation',
          '/ptbr/',
          '/ptbr/guide/',
          {
            title: 'Conceitos Básicos',
            collapsable: false,
            children: [
              '/ptbr/guide/state',
              '/ptbr/guide/getters',
              '/ptbr/guide/mutations',
              '/ptbr/guide/actions',
              '/ptbr/guide/modules'
            ]
          },
          '/ptbr/guide/structure',
          '/ptbr/guide/plugins',
          '/ptbr/guide/strict',
          '/ptbr/guide/forms',
          '/ptbr/guide/testing',
          '/ptbr/guide/hot-reload'
        ]
      }
    }
  }
}
