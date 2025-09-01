<script setup lang="ts">
import * as dashjs from 'dashjs';
import { onMounted, PropType, ref, Ref, useTemplateRef, watch } from 'vue'
import type { DashChannel } from '@/types/DashChannel.ts'

const props = defineProps({
  channel: {
    type: Object as PropType<WebChannel>,
    required: true
  }
})

const showName = ref(false)
let nameTimeout: number | null = null;

onMounted(() => {
  makeNameVisible();
})

watch(() => props.channel.name, () => {
  makeNameVisible();
})

function makeNameVisible() {
  clearTimeout(nameTimeout)
  showName.value = true
  nameTimeout = setTimeout(() => showName.value = false, 3000)
}
</script>

<template>
  <div class="tt-channel-name" :class="{'tt-channel-name--visible': showName}">
    {{channel.name}}
  </div>
  <iframe :src="channel.url" class="tt-iframe"/>
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
