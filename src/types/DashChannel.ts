import { Channel, ChannelType } from './Channel.ts'

export class DashChannel extends Channel {
  url: string;

  constructor(name: string, url: string) {
    super(name, ChannelType.Dash)
    this.url = url;
  }
}
