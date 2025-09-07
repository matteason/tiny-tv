import { Channel, ChannelType } from './Channel.ts'

export class YoutubeChannel extends Channel {
  playlistId: string

  constructor(name: string, playlistId: string) {
    super(name, ChannelType.Youtube)
    this.playlistId = playlistId
  }
}
