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

const playerElement: Ref<HTMLVideoElement | null> = useTemplateRef('player')
const glowElement: Ref<HTMLCanvasElement | null> = useTemplateRef('glow')
const staticElement: Ref<HTMLVideoElement | null> = useTemplateRef('static')
const dashPlayer = dashjs.MediaPlayer().create()
const showStatic = ref(true)
const showName = ref(false)
let nameTimeout: number | null = null

dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, () => (showStatic.value = false))

onMounted(() => {
  initialisePlayer()
  playerElement.value.volume = props.volume
  staticElement.value.playbackRate = 0.75
  makeNameVisible()
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
      showStatic.value = true
      dashPlayer.attachSource(props.channel.url)
      dashPlayer.play()
    }
  },
)

watch(
  () => props.channel.name,
  () => {
    makeNameVisible()
  },
)

function makeNameVisible() {
  clearTimeout(nameTimeout)
  showName.value = true
  nameTimeout = setTimeout(() => (showName.value = false), 3000)
}

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
    const ctx = glowElement.value.getContext('2d')
    ctx.beginPath()
    ctx.rect(20, 20, 150, 100)
    ctx.stroke()
  }

  requestAnimationFrame(() => {
    processFrame()
  })
}
</script>

<template>
  <div>
    <div class="tt-channel-name" :class="{ 'tt-channel-name--visible': showName }">
      {{ channel.name }}
    </div>
    <div class="tt-player">
      <video class="tt-player__video" ref="player" disablepictureinpicture />
    </div>
    <div class="tt-player tt-player--glow">
      <canvas
        class="tt-player__video tt-player__video--glow"
        ref="glow"
        width="1920"
        height="1080"
      />
    </div>
    <div class="tt-player tt-player--static" :class="{ 'tt-player--static--overlay': !showStatic }">
      <video
        class="tt-player__video tt-player__video--static"
        src="/static.mp4"
        autoplay
        muted
        loop
        disablepictureinpicture
        ref="static"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
$player-padding: 0px;
.tt-channel-name {
  font-size: 2em;
  z-index: 100;
  position: absolute;
  top: 5vh;
  left: 5vh;
  pointer-events: none;
  touch-action: none;
  filter: blur(1px);
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.1s;
  text-shadow:
    -2px 0 2px rgba(255, 0, 0, 0.25),
    2px 0 2px rgba(0, 0, 255, 0.25);

  &--visible {
    opacity: 1;
  }
}

.tt-player {
  position: absolute;
  inset: $player-padding;
  display: flex;
  pointer-events: none;
  touch-action: none;
  overflow: hidden;

  &__video {
    width: 100%;
    object-fit: cover;
    filter: blur(1px) saturate(150%) hue-rotate(5deg);

    &--glow {
      filter: blur(5px) saturate(150%) hue-rotate(20deg);
      opacity: 0.5;
      mix-blend-mode: lighten;
    }
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    $scanline-opacity: 0.1;
    background:
      repeating-linear-gradient(
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0) 5px,
        rgba(0, 0, 0, $scanline-opacity) 5px,
        rgba(0, 0, 0, $scanline-opacity) 7px
      ),
      repeating-linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0) 2px,
        rgba(0, 0, 0, $scanline-opacity) 2px,
        rgba(0, 0, 0, $scanline-opacity) 4px
      ),
      radial-gradient(rgba(0, 0, 0, 0) 70%, rgb(0, 0, 0, 0.3));
    z-index: 100;
    filter: blur(1px);
  }

  &--glow::before {
    content: none;
  }

  &--static {
    transition: opacity 0.1s;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: blue;
      mix-blend-mode: overlay;
      opacity: 0.2;
      z-index: 150;
    }

    &--overlay {
      opacity: 0.05;
      mix-blend-mode: overlay;
    }
  }
}
</style>
