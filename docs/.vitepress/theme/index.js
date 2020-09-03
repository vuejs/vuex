import '../styles/styles.css'

import DefaultTheme from 'vitepress/dist/client/theme-default'
import VideoPreview from '../components/VideoPreview.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('VideoPreview', VideoPreview)
  }
}
