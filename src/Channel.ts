import EventEmitter from 'events';

import Ably from 'ably';

export interface Pong {
  seq: number;
  src: string;
  dst: string;
  diff: number;
}

type PongCallback = (pong: Pong) => void;

export class Channel extends EventEmitter {
  client: Ably.Realtime;
  channel: Ably.Types.RealtimeChannelCallbacks;
  presence: Ably.Types.RealtimePresenceCallbacks;
  seq: number;

  constructor(client: Ably.Realtime) {
    super();
    this.client = client;
    this.channel = client.channels.get('ably-latency-map');
    this.presence = this.channel.presence;
    this.seq = 1;
    this.channel.subscribe(this.handleMessage.bind(this));
  }

  publish(botId: string) {
    this.channel.publish('request', { seq: this.seq, botId });
    this.seq++;
  }

  handleMessage({ name, data }: Ably.Types.Message) {
    console.log(`Handling message: name="${name}" data="${JSON.stringify(data)}"`);

    switch (name) {
      case 'request':
        break;
      case 'ping':
        break;
      case 'pong':
        this.emit(`pong:${data.dst}`, data);
        break;
      default:
        console.error(`Unhandled message: ${name}`);
    }
  }

  onPong(botId: string, callback: PongCallback) {
    this.on(`pong:${botId}`, callback);
  }

  offPong(botId: string, callback: PongCallback) {
    this.off(`pong:${botId}`, callback);
  }
};
