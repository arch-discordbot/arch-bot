import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  constructor() {
    super('clientReady', {
      event: 'ready',
      emitter: 'client',
    });
  }

  exec() {
    this.client.logger.info(`Logged in as ${this.client.user?.tag}`);

    this.client.user?.setActivity({
      type: 'WATCHING',
      name: 'for a! or arch',
    });
  }
}
