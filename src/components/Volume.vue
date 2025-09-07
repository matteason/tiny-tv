<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel({ type: Number })
const visible = ref(false)
</script>

<template>
  <div
    class="tt-volume"
    :class="{ 'tt-volume--visible': visible }"
    @touchstart="visible = true"
    @touchend="visible = false"
    @mousedown="visible = true"
    @mouseup="visible = false"
  >
    <label for="volume" class="tt-volume__label">Volume</label>
    <input
      id="volume"
      class="tt-volume__input"
      type="range"
      min="0"
      max="1"
      step="0.04"
      v-model.number="model"
    />
  </div>
</template>

<style scoped lang="scss">
.tt-volume {
  $vol-side-padding: 100px;
  $vol-steps: 25;
  position: absolute;
  inset: auto $vol-side-padding 50px $vol-side-padding;
  z-index: 200;
  opacity: 0;
  filter: blur(1px);
  transition: opacity 0.1s;

  &--visible {
    opacity: 1;
  }

  &__label {
    display: block;
    margin-left: calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.25);
    margin-bottom: 2vh;
    text-transform: uppercase;
  }

  &__input {
    display: block;
    width: 100%;
    height: 12vh;
    background: transparent;

    &::-moz-range-thumb {
      opacity: 0;
    }

    &::-moz-range-track {
      height: 20%;
      background: repeating-linear-gradient(
        to right,
        transparent,
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.25),
        lime calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.25),
        lime calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.75),
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.75),
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps))
      );
    }

    &::-moz-range-progress {
      height: 100%;
      background: repeating-linear-gradient(
        to right,
        transparent,
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.25),
        lime calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.25),
        lime calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.75),
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps) * 0.75),
        transparent calc((100vw - $vol-side-padding * 2) / ($vol-steps))
      );
    }
  }
}
</style>
