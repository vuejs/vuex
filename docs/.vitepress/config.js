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
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
  ],

  themeConfig: {
    repo: 'vuejs/vuex',
    docsDir: 'docs',
    docsBranch: '4.0',

    editLinks: true,

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
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://vuex.vuejs.org/' }
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

      '/ptbr/': {
        label: 'Português',
        selectText: 'Idiomas',
        editLinkText: 'Edite esta página no GitHub',

        nav: [
          { text: 'Guia', link: '/ptbr/guide/' },
          { text: 'Referência da API', link: '/ptbr/api/' },
          { text: 'Notas de Lançamento', link: 'https://github.com/vuejs/vuex/releases' },
          {
            text: 'v4.x',
            items: [
              { text: 'v3.x', link: 'https://vuex.vuejs.org/ptbr/' }
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
