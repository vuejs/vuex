module.exports = {
  lang: 'en-US',
  title: 'Vuex',
  description: 'Centralized State Management for Vue.js',

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
    '/ptbr/': {
      lang: 'pt-BR',
      title: 'Vuex',
      description: 'Gerenciamento de Estado Centralizado para Vue.js'
    }
  },

  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }]
  ],

  themeConfig: {
    repo: 'vuejs/vuex',
    docsDir: 'docs',
    docsBranch: 'main',

    editLinks: true,

    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',

        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'API Reference', link: '/api/' },
          { text: 'Release Notes', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://v3.vuex.vuejs.org/' }
            ]
          }
        ],

        sidebar: [
          {
            text: 'Introduction',
            children: [
              { text: 'What is Vuex?', link: '/' },
              { text: 'Installation', link: '/installation' },
              { text: 'Getting Started', link: '/guide/' }
            ]
          },
          {
            text: 'Core Concepts',
            children: [
              { text: 'State', link: '/guide/state' },
              { text: 'Getters', link: '/guide/getters' },
              { text: 'Mutations', link: '/guide/mutations' },
              { text: 'Actions', link: '/guide/actions' },
              { text: 'Modules', link: '/guide/modules' }
            ]
          },
          {
            text: 'Advanced',
            children: [
              { text: 'Application Structure', link: '/guide/structure' },
              { text: 'Composition API', link: '/guide/composition-api' },
              { text: 'Plugins', link: '/guide/plugins' },
              { text: 'Strict Mode', link: '/guide/strict' },
              { text: 'Form Handling', link: '/guide/forms' },
              { text: 'Testing', link: '/guide/testing' },
              { text: 'Hot Reloading', link: '/guide/hot-reload' },
              { text: 'TypeScript Support', link: '/guide/typescript-support' },
            ]
          },
          {
            text: 'Migration Guide',
            children: [
              { text: 'Migrating to 4.0 from 3.x', link: '/guide/migrating-to-4-0-from-3-x' }
            ]
          }
        ]
      },

      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '最近更新时间',

        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: 'API 参考', link: '/zh/api/' },
          { text: '更新记录', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://v3.vuex.vuejs.org/zh' }
            ]
          }
        ],

        sidebar: [
          {
            text: '介绍',
            children: [
              { text: 'Vuex 是什么?', link: '/zh/' },
              { text: '安装', link: '/zh/installation' },
              { text: '开始', link: '/zh/guide/' }
            ]
          },
          {
            text: '核心概念',
            children: [
              { text: 'State', link: '/zh/guide/state' },
              { text: 'Getter', link: '/zh/guide/getters' },
              { text: 'Mutation', link: '/zh/guide/mutations' },
              { text: 'Action', link: '/zh/guide/actions' },
              { text: 'Module', link: '/zh/guide/modules' }
            ]
          },
          {
            text: '进阶',
            children: [
              { text: '项目结构', link: '/zh/guide/structure' },
              { text: '组合式 API', link: '/zh/guide/composition-api' },
              { text: '插件', link: '/zh/guide/plugins' },
              { text: '严格模式', link: '/zh/guide/strict' },
              { text: '表单处理', link: '/zh/guide/forms' },
              { text: '测试', link: '/zh/guide/testing' },
              { text: '热重载', link: '/zh/guide/hot-reload' },
              { text: 'TypeScript 支持', link: '/zh/guide/typescript-support' },
            ]
          },
          {
            text: '迁移指南',
            children: [
              { text: '从 3.x 迁移到 4.0', link: '/zh/guide/migrating-to-4-0-from-3-x' }
            ]
          }
        ]
      },

      '/ja/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'GitHub 上でこのページを編集する',
        lastUpdated: '最終更新日時',

        nav: [
          { text: 'ガイド', link: '/ja/guide/' },
          { text: 'API リファレンス', link: '/ja/api/' },
          { text: 'リリースノート', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://v3.vuex.vuejs.org/ja' }
            ]
          }
        ],

        sidebar: [
          {
            text: 'はじめに',
            children: [
              { text: 'Vuex とは何か？', link: '/ja/' },
              { text: 'インストール', link: '/ja/installation' },
              { text: 'Vuex 入門', link: '/ja/guide/' }
            ]
          },
          {
            text: 'コアコンセプト',
            children: [
              { text: 'ステート', link: '/ja/guide/state' },
              { text: 'ゲッター', link: '/ja/guide/getters' },
              { text: 'ミューテーション', link: '/ja/guide/mutations' },
              { text: 'アクション', link: '/ja/guide/actions' },
              { text: 'モジュール', link: '/ja/guide/modules' }
            ]
          },
          {
            text: '高度な活用',
            children: [
              { text: 'アプリケーションの構造', link: '/ja/guide/structure' },
              { text: 'Composition API', link: '/ja/guide/composition-api' },
              { text: 'プラグイン', link: '/ja/guide/plugins' },
              { text: '厳格モード', link: '/ja/guide/strict' },
              { text: 'フォームの扱い', link: '/ja/guide/forms' },
              { text: 'テスト', link: '/ja/guide/testing' },
              { text: 'ホットリローディング', link: '/ja/guide/hot-reload' },
              { text: 'TypeScript サポート', link: '/ja/guide/typescript-support' },
            ]
          },
          {
            text: '移行 ガイド',
            children: [
              { text: '3.x から 4.0 への移行', link: '/ja/guide/migrating-to-4-0-from-3-x' }
            ]
          }
        ]
      },

      '/ptbr/': {
        label: 'Português',
        selectText: 'Idiomas',
        editLinkText: 'Edite esta página no GitHub',
        lastUpdated: 'Última Atualização',

        nav: [
          { text: 'Guia', link: '/ptbr/guide/' },
          { text: 'Referência da API', link: '/ptbr/api/' },
          { text: 'Notas de Lançamento', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://v3.vuex.vuejs.org/ptbr/' }
            ]
          }
        ],

        sidebar: [
          {
            text: 'Introdução',
            children: [
              { text: 'O que é Vuex?', link: '/ptbr/' },
              { text: 'Instalação', link: '/ptbr/installation' },
              { text: 'Começando', link: '/ptbr/guide/' }
            ]
          },
          {
            text: 'Conceitos Básicos',
            children: [
              { text: 'Estado', link: '/ptbr/guide/state' },
              { text: 'Getters', link: '/ptbr/guide/getters' },
              { text: 'Mutações', link: '/ptbr/guide/mutations' },
              { text: 'Ações', link: '/ptbr/guide/actions' },
              { text: 'Módulos', link: '/ptbr/guide/modules' }
            ]
          },
          {
            text: 'Avançado',
            children: [
              { text: 'Estrutura da Aplicação', link: '/ptbr/guide/structure' },
              { text: 'Composition API', link: '/ptbr/guide/composition-api' },
              { text: 'Plugins', link: '/ptbr/guide/plugins' },
              { text: 'Modo Strict', link: '/ptbr/guide/strict' },
              { text: 'Manipulação de Formulários', link: '/ptbr/guide/forms' },
              { text: 'Testando', link: '/ptbr/guide/testing' },
              { text: 'Hot Reloading', link: '/ptbr/guide/hot-reload' },
              { text: 'Suporte ao TypeScript', link: '/ptbr/guide/typescript-support' },
            ]
          },
          {
            text: 'Guia de Migração',
            children: [
              { text: 'Migrando do 3.x para 4.0', link: '/ptbr/guide/migrating-to-4-0-from-3-x' }
            ]
          }
        ]
      }
    }
  }
}
