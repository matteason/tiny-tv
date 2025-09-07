<script setup lang="ts">
import * as dashjs from 'dashjs'
import { onMounted, PropType, ref, Ref, useTemplateRef, watch } from 'vue'
import type { DashChannel } from '@/types/DashChannel.ts'

const props = defineProps({
  channel: {
    type: Object as PropType<DashChannel>,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['loading', 'loaded'])

const playerElement: Ref<HTMLVideoElement | null> = useTemplateRef('player')
const glowElement: Ref<HTMLCanvasElement | null> = useTemplateRef('glow')
const dashPlayer = dashjs.MediaPlayer().create()

dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, () => {
  emit('loaded')
})

onMounted(() => {
  if (playerElement.value) {
    emit('loading')
    initialisePlayer()
    playerElement.value.volume = props.volume
  }
})

watch(
  () => props.volume,
  () => {
    if (playerElement.value) {
      playerElement.value.volume = props.volume
    }
  },
)

watch(
  () => props.channel.url,
  () => {
    if (playerElement.value) {
      emit('loading')
      dashPlayer.attachSource(props.channel.url)
      dashPlayer.play()
    }
  },
)

function initialisePlayer() {
  if (playerElement.value) {
    dashPlayer.initialize(playerElement.value, props.channel.url, true)
    playerElement.value?.addEventListener('play', () => {
      processFrame()
    })
  }
}
function processFrame() {
  if (playerElement.value && glowElement.value) {
    glowElement.value
      .getContext('2d')
      .drawImage(playerElement.value, 0, 0, glowElement.value.width, glowElement.value.height)
  }

  requestAnimationFrame(() => {
    processFrame()
  })
}
</script>

<template>
  <div class="tt-player">
    <video class="tt-player__video" ref="player" disablepictureinpicture />
  </div>
  <div class="tt-player tt-player--glow">
    <canvas class="tt-player__video tt-player__video--glow" ref="glow" width="1920" height="1080" />
  </div>
</template>

<style scoped lang="scss"></style>
