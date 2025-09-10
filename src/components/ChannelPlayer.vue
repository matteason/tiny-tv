<script setup lang="ts">
import { computed, onMounted, PropType, ref, Ref, useTemplateRef, watch } from 'vue'
import type { DashChannel } from '@/types/DashChannel.ts'
import { ChannelType } from '@/types/Channel.ts'
import WebChannelPlayer from '@/components/WebChannelPlayer.vue'
import YoutubeChannelPlayer from '@/components/YoutubeChannelPlayer.vue'
import DashPlayer from '@/components/DashPlayer.vue'

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

const staticElement: Ref<HTMLVideoElement | null> = useTemplateRef('static')
const showStatic = ref(false)
const showName = ref(false)
let nameTimeout: number | null = null

onMounted(() => {
  staticElement.value.playbackRate = 0.75
  makeNameVisible()
})

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

const playerComponent = computed(() => {
  switch (props.channel.type) {
    case ChannelType.Web:
      return WebChannelPlayer
    case ChannelType.Youtube:
      return YoutubeChannelPlayer
    case ChannelType.Dash:
      return DashPlayer
  }
})

function onLoading() {
  showStatic.value = true
}

function onLoaded() {
  showStatic.value = false
}
</script>

<template>
  <div>
    <div class="tt-channel-name" :class="{ 'tt-channel-name--visible': showName }">
      {{ channel.name }}
    </div>

    <component
      :is="playerComponent"
      :channel="channel"
      :volume="volume"
      @loading="onLoading"
      @loaded="onLoaded"
    ></component>
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
    <div class="tt-scanlines"></div>
  </div>
</template>

<style lang="scss">
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
  }

  &--static {
    transition: opacity 0.2s;

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

.tt-scanlines {
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
</style>
