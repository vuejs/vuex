<template>
  <a v-if="!opened" href="#" @click.prevent="opened = true">
    <img :src="img" :alt="title" style="border-radius: 6px;">
  </a>
  <div v-else>
    <iframe
      width="640" height="360" frameborder="0" :src="url"
      webkitallowfullscreen mozallowfullscreen allowfullscreen
    ></iframe>
  </div>
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
  data() {
    return { opened: false };
  }
}
</script>
