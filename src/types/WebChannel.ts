import { Channel, ChannelType } from './Channel.ts'

export class WebChannel extends Channel {
  url: string;

  constructor(name: string, url: string) {
    super(name, ChannelType.Web)
    this.url = url;
  }
}
