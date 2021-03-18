import { setupDevtoolsPlugin } from '@vue/devtools-api'

export function addDevtools (app, store) {
  setupDevtoolsPlugin({
    id: 'vuex',
    app,
    label: 'Vuex',
    homepage: 'https://next.vuex.vuejs.org/',
    logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
    packageName: 'vuex'
  }, api => {
    // @TODO
  })
}
