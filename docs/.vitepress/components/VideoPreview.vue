<template>
  <a href="#" @click.prevent="open">
    <img :src="img" :alt="title" style="border-radius: 6px;">
  </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Play Vuex Explained Visually Video"
    },
    img: {
      type: String,
      default: "/vuex-explained-visually.png"
    },
    url: {
      type: String,
      default: "https://player.vimeo.com/video/297515936?autoplay=1"
    }
  },
  methods: {
    open() {
      // dropped v-if/v-else way to fix autoplay issue on Chrome
      // https://github.com/vuejs/vuex/pull/1453#issuecomment-441507095
      const { $el, url } = this
      if (!$el || !$el.parentNode) {
        return
      }
      const attrs = {
        width: 640,
        height: 360,
        frameborder: 0,
        src: url,
        webkitallowfullscreen: true,
        mozallowfullscreen: true,
        allowfullscreen: true
      }
      const video = document.createElement('iframe')
      for (const name in attrs) {
        video.setAttribute(name, attrs[name])
      }
      $el.parentNode.replaceChild(video, $el)
    }
  }
}
</script>
