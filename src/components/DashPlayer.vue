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
  }
}
</script>

<template>
  <div class="tt-player">
    <video class="tt-player__video" ref="player" disablepictureinpicture />
  </div>
</template>

<style scoped lang="scss"></style>
