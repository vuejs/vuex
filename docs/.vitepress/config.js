module.exports = {
  lang: 'en-US',
  title: 'Vuex',
  description: 'Centralized State Management for Vue.js',

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vuex',
      description: 'Centralized State Management for Vue.js'
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
      }
    }
  }
}
