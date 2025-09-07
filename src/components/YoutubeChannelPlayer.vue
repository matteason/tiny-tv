<script setup lang="ts">
import { onBeforeUnmount, onMounted, PropType, watch } from 'vue'
import type { YoutubeChannel } from '@/types/YoutubeChannel.ts'

const props = defineProps({
  channel: {
    type: Object as PropType<YoutubeChannel>,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['loading', 'loaded'])

let ytPlayer: any = null
let YT: any = window.YT

onMounted(() => {
  emit('loading')

  // We create an inner child that's not managed by Vue to be replaced by the iframe
  // This avoids issues from a Vue-managed div being replaced
  const outer = document.getElementById('yt-outer-container')
  const inner = document.createElement('div')
  inner.id = 'yt-player-div'
  inner.classList.add('tt-youtube')
  outer.appendChild(inner)

  ytPlayer = new YT.Player('yt-player-div', {
    height: '390',
    width: '640',
    playerVars: {
      playsinline: 1,
      autoplay: 1,
      controls: 0,
      listType: 'playlist',
      list: props.channel.playlistId,
      iv_load_policy: 3,
    },
    events: {
      onReady: onPlayerReady,
      //'onStateChange': onPlayerStateChange
    },
  })
})

watch(
  () => props.volume,
  () => {
    ytPlayer.setVolume(props.volume * 100)
  },
)

function onPlayerReady() {
  ytPlayer.setVolume(props.volume * 100)
  ytPlayer.setShuffle(true)
  ytPlayer.setLoop(true)
  ytPlayer.seekTo(Math.floor(Math.random() * 600))
  ytPlayer.playVideoAt(1)
  emit('loaded')
}

onBeforeUnmount(() => {
  ytPlayer.destroy()
})
</script>

<template>
  <div id="yt-outer-container"></div>
</template>

<style lang="scss">
.tt-youtube {
  position: absolute;
  inset: 0;
  border: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transform: scale(1.2);
}
</style>
