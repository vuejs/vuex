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
    },
    '/fr/': {
      lang: 'fr-FR',
      title: 'Vuex',
      description: 'Gestion d\'état centralisé pour Vue.js'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
  ],
  serviceWorker: true,
  theme: '@vuepress/vue',
  themeConfig: {
    // algolia: {
    //   apiKey: '97f135e4b5f5487fb53f0f2dae8db59d',
    //   indexName: 'vuex',
    // },
    repo: 'vuejs/vuex',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'API Reference', link: '/api/' },
          { text: 'Release Notes', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Introduction',
            collapsable: false,
            children: [
              { title: 'What is Vuex?', path: '/' },
              { title: 'Installation', path: '/installation' },
              { title: 'Getting Started', path: '/guide/' }
            ]
          },
          {
            title: 'Core Concepts',
            collapsable: false,
            children: [
              { title: 'State', path: '/guide/state' },
              { title: 'Getters', path: '/guide/getters' },
              { title: 'Mutations', path: '/guide/mutations' },
              { title: 'Actions', path: '/guide/actions' },
              { title: 'Modules', path: '/guide/modules' }
            ]
          },
          {
            title: 'Advanced',
            collapsable: false,
            children: [
              { title: 'Application Structure', path: '/guide/structure' },
              { title: 'Plugins', path: '/guide/plugins' },
              { title: 'Strict Mode', path: '/guide/strict' },
              { title: 'Form Handling', path: '/guide/forms' },
              { title: 'Testing', path: '/guide/testing' },
              { title: 'Hot Reloading', path: '/guide/hot-reload' }
            ]
          }
        ]
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: 'API 参考', link: '/zh/api/' },
          { text: '更新记录', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: '介绍',
            collapsable: false,
            children: [
              { title: 'Vuex 是什么？', path: '/zh/' },
              { title: '安装', path: '/zh/installation' },
              { title: '开始', path: '/zh/guide/' }
            ]
          },
          {
            title: '核心概念',
            collapsable: false,
            children: [
              { title: 'State', path: '/zh/guide/state' },
              { title: 'Getters', path: '/zh/guide/getters' },
              { title: 'Mutations', path: '/zh/guide/mutations' },
              { title: 'Actions', path: '/zh/guide/actions' },
              { title: 'Modules', path: '/zh/guide/modules' }
            ]
          },
          {
            title: '进阶',
            collapsable: false,
            children: [
              { title: '项目结构', path: '/zh/guide/structure' },
              { title: '插件', path: '/zh/guide/plugins' },
              { title: '严格模式', path: '/zh/guide/strict' },
              { title: '表单处理', path: '/zh/guide/forms' },
              { title: '测试', path: '/zh/guide/testing' },
              { title: '热重载', path: '/zh/guide/hot-reload' }
            ]
          }
        ]
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'GitHub 上でこのページを編集する',
        nav: [
          { text: 'ガイド', link: '/ja/guide/' },
          { text: 'API リファレンス', link: '/ja/api/' },
          { text: 'リリースノート', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'はじめに',
            collapsable: false,
            children: [
              { title: 'Vuex とは何か？', path: '/ja/' },
              { title: 'インストール', path: '/ja/installation' },
              { title: 'Vuex 入門', path: '/ja/guide/' }
            ]
          },
          {
            title: 'コアコンセプト',
            collapsable: false,
            children: [
              { title: 'ステート', path: '/ja/guide/state' },
              { title: 'ゲッター', path: '/ja/guide/getters' },
              { title: 'ミューテーション', path: '/ja/guide/mutations' },
              { title: 'アクション', path: '/ja/guide/actions' },
              { title: 'モジュール', path: '/ja/guide/modules' }
            ]
          },
          {
            title: '高度な活用',
            collapsable: false,
            children: [
              { title: 'アプリケーションの構造', path: '/ja/guide/structure' },
              { title: 'プラグイン', path: '/ja/guide/plugins' },
              { title: '厳格モード', path: '/ja/guide/strict' },
              { title: 'フォームの扱い', path: '/ja/guide/forms' },
              { title: 'テスト', path: '/ja/guide/testing' },
              { title: 'ホットリローディング', path: '/ja/guide/hot-reload' }
            ]
          }
        ]
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Переводы',
        editLinkText: 'Изменить эту страницу на GitHub',
        nav: [
          { text: 'Руководство', link: '/ru/guide/' },
          { text: 'Справочник API', link: '/ru/api/' },
          { text: 'История изменений', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Введение',
            collapsable: false,
            children: [
              { title: 'Что такое Vuex?', path: '/ru/' },
              { title: 'Установка', path: '/ru/installation' },
              { title: 'Введение', path: '/ru/guide/' }
            ]
          },
          {
            title: 'Основные понятия',
            collapsable: false,
            children: [
              { title: 'Состояние', path: '/ru/guide/state' },
              { title: 'Геттеры', path: '/ru/guide/getters' },
              { title: 'Мутации', path: '/ru/guide/mutations' },
              { title: 'Действия', path: '/ru/guide/actions' },
              { title: 'Модули', path: '/ru/guide/modules' }
            ]
          },
          {
            title: 'Продвинутые темы',
            collapsable: false,
            children: [
              { title: 'Структура приложения', path: '/ru/guide/structure' },
              { title: 'Плагины', path: '/ru/guide/plugins' },
              { title: 'Строгий режим (strict mode)', path: '/ru/guide/strict' },
              { title: 'Работа с формами', path: '/ru/guide/forms' },
              { title: 'Тестирование', path: '/ru/guide/testing' },
              { title: 'Горячая перезагрузка', path: '/ru/guide/hot-reload' }
            ]
          }
        ]
      },
      '/kr/': {
        label: '한국어',
        selectText: '언어 변경',
        editLinkText: 'GitHub에서 이 페이지 수정',
        nav: [
          { text: '가이드', link: '/kr/guide/' },
          { text: 'API 레퍼런스', link: '/kr/api/' },
          { text: '릴리즈 노트', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Introduction',
            collapsable: false,
            children: [
              { title: 'Vuex가 무엇인가요?', path: '/kr/' },
              { title: '설치', path: '/kr/installation' },
              { title: '시작하기', path: '/kr/guide/' }
            ]
          },
          {
            title: '핵심 컨셉',
            collapsable: false,
            children: [
              { title: '상태', path: '/kr/guide/state' },
              { title: 'Getters', path: '/kr/guide/getters' },
              { title: '변이', path: '/kr/guide/mutations' },
              { title: '액션', path: '/kr/guide/actions' },
              { title: '모듈', path: '/kr/guide/modules' }
            ]
          },
          {
            title: 'Advanced',
            collapsable: false,
            children: [
              { title: '애플리케이션 구조', path: '/kr/guide/structure' },
              { title: '플러그인', path: '/kr/guide/plugins' },
              { title: 'Strict 모드', path: '/kr/guide/strict' },
              { title: '폼 핸들링', path: '/kr/guide/forms' },
              { title: '테스팅', path: '/kr/guide/testing' },
              { title: '핫 리로딩', path: '/kr/guide/hot-reload' }
            ]
          }
        ]
      },
      '/ptbr/': {
        label: 'Português',
        selectText: 'Idiomas',
        editLinkText: 'Edite esta página no GitHub',
        nav: [
          { text: 'Guia', link: '/ptbr/guide/' },
          { text: 'Referência da API', link: '/ptbr/api/' },
          { text: 'Notas da Versão', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/ptbr/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Introdução',
            collapsable: false,
            children: [
              { title: 'O que é Vuex?', path: '/ptbr/' },
              { title: 'Instalação', path: '/ptbr/installation' },
              { title: 'Começando', path: '/ptbr/guide/' }
            ]
          },
          {
            title: 'Conceitos Básicos',
            collapsable: false,
            children: [
              { title: 'Estado', path: '/ptbr/guide/state' },
              { title: 'Getters', path: '/ptbr/guide/getters' },
              { title: 'Mutações', path: '/ptbr/guide/mutations' },
              { title: 'Ações', path: '/ptbr/guide/actions' },
              { title: 'Módulos', path: '/ptbr/guide/modules' }
            ]
          },
          {
            title: 'Avançado',
            collapsable: false,
            children: [
              { title: 'Estrutura da Aplicação', path: '/ptbr/guide/structure' },
              { title: 'Plugins', path: '/ptbr/guide/plugins' },
              { title: 'Modo Estrito', path: '/ptbr/guide/strict' },
              { title: 'Manipulação de Formulários', path: '/ptbr/guide/forms' },
              { title: 'Testando', path: '/ptbr/guide/testing' },
              { title: 'Hot Reloading (Recarregamento Rápido)', path: '/ptbr/guide/hot-reload' }
            ]
          }
        ]
      },
      '/fr/': {
        label: 'Français',
        selectText: 'Langues',
        editLinkText: 'Éditer la page sur GitHub',
        nav: [
          { text: 'Guide', link: '/fr/guide/' },
          { text: 'API', link: '/fr/api/' },
          { text: 'Notes de version', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v3.x',
            items: [
              { text: 'v4.x', link: 'https://next.vuex.vuejs.org/' }
            ]
          }
        ],
        sidebar: [
          {
            title: 'Introduction',
            collapsable: false,
            children: [
              { title: "Vuex, qu'est-ce que c'est ?", path: '/fr/' },
              { title: 'Installation', path: '/fr/installation' },
              { title: 'Pour commencer', path: '/fr/guide/' }
            ]
          },
          {
            title: 'Concepts centraux',
            collapsable: false,
            children: [
              { title: 'State', path: '/fr/guide/state' },
              { title: 'Accesseurs', path: '/fr/guide/getters' },
              { title: 'Mutations', path: '/fr/guide/mutations' },
              { title: 'Actions', path: '/fr/guide/actions' },
              { title: 'Modules', path: '/fr/guide/modules' }
            ]
          },
          {
            title: 'Avancés',
            collapsable: false,
            children: [
              { title: "Structure d'une application", path: '/fr/guide/structure' },
              { title: 'Plugins', path: '/fr/guide/plugins' },
              { title: 'Mode strict', path: '/fr/guide/strict' },
              { title: 'Gestion des formulaires', path: '/fr/guide/forms' },
              { title: 'Tests', path: '/fr/guide/testing' },
              { title: 'Rechargement à chaud', path: '/fr/guide/hot-reload' }
            ]
          }
        ]
      }
    }
  }
}
