<script setup lang="ts">
import Volume from '@/components/Volume.vue'
import ChannelChanger from '@/components/ChannelChanger.vue'
import { computed, ref } from 'vue'
import { WebChannel } from '@/types/WebChannel.ts'
import { DashChannel } from '@/types/DashChannel.ts'
import { ChannelType } from '@/types/Channel.ts'
import WebChannelPlayer from '@/components/WebChannelPlayer.vue'
import DashPlayer from '@/components/DashPlayer.vue'

const channels = [
  new DashChannel(
    'BBC One',
    'https://vs-cmaf-push-uk-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_one_london/pc_hd_abr_v2.mpd',
  ),
  new DashChannel(
    'BBC Two',
    'https://vs-cmaf-push-uk.live.cf.md.bbci.co.uk/x=4/i=urn:bbc:pips:service:bbc_two_hd/pc_hd_abr_v2.mpd',
  ),
  new DashChannel(
    'BBC News',
    'https://vs-cmaf-push-uk.live.fastly.md.bbci.co.uk/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/pc_hd_abr_v2.mpd',
  ),
  new DashChannel(
    'Channel 4',
    'https://viamotionhsi.netplus.ch/live/eds/channel4/browser-dash/channel4.mpd',
  ),
  new WebChannel('ISS', 'https://iss.matteason.co.uk'),
  new WebChannel('OFF', 'about:blank'),
]

const currentChannelIndex = ref(0)
const volume = ref(1)

const currentChannel = computed(() => {
  return channels[currentChannelIndex.value]
})
</script>

<template>
  <ChannelChanger v-model="currentChannelIndex" :max-channel-index="channels.length - 1" />
  <Volume v-model="volume" />
  <WebChannelPlayer v-if="currentChannel.type === ChannelType.Web" :channel="currentChannel" />
  <DashPlayer
    v-else-if="currentChannel.type === ChannelType.Dash"
    :channel="currentChannel"
    :volume="volume"
  />
</template>

<style lang="scss">
@font-face {
  font-family: VCR;
  src: url('/fonts/vcr.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

body {
  color: lime;
  font-size: 3rem;
  margin: 0;
  padding: 0;
  background: black;
  font-family: VCR;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

#app {
  overflow: hidden;
  position: absolute;
  inset: 0;
}

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
</style>
