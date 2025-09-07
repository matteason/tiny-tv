<script setup lang="ts">
import type { PropType } from 'vue'
import type { WebChannel } from '@/types/WebChannel.ts'

const props = defineProps({
  channel: {
    type: Object as PropType<WebChannel>,
    required: true,
  },
})
</script>

<template>
  <iframe :src="channel.url" class="tt-iframe" />
</template>

<style scoped lang="scss">
.tt-iframe {
  position: absolute;
  inset: 0;
  border: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
