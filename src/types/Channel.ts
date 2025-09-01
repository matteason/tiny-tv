export enum ChannelType {
  'Web' = 'WEB',
  'Dash' = 'DASH'
}

export abstract class Channel {
  name: string;
  type: ChannelType;

  protected constructor(name: string, type: ChannelType) {
    this.name = name;
    this.type = type;
  }
}
