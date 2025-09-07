<script setup lang="ts">
const props = defineProps({
  maxChannelIndex: {
    type: Number,
    required: true,
  },
})

const model = defineModel({ type: Number })

function channelDown() {
  if (model.value === 0) {
    model.value = props.maxChannelIndex
  } else {
    model.value--
  }
  goFullscreen()
}

function channelUp() {
  if (model.value === props.maxChannelIndex) {
    model.value = 0
  } else {
    model.value++
  }
  goFullscreen()
}

function goFullscreen() {
  //document.getElementById('app').requestFullscreen()
}
</script>

<template>
  <div class="tt-channel-changer">
    <button class="tt-channel-changer--button" @click="channelDown">Channel down</button>
    <button class="tt-channel-changer--button" @click="channelUp">Channel up</button>
  </div>
</template>

<style scoped lang="scss">
.tt-channel-changer {
  position: absolute;
  inset: 30vh 0 30vh 0;
  z-index: 1000;
  display: flex;

  &--button {
    display: block;
    flex-grow: 1;
    width: 50%;
    opacity: 0;
  }
}
</style>
