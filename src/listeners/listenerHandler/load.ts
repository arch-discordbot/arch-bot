import { Listener } from 'discord-akairo';

export default class LoadListener extends Listener {
  constructor() {
    super('listenerLoad', {
      event: 'load',
      emitter: 'listenerHandler',
    });
  }

  exec(listener: Listener) {
    this.client.logger.debug(
      `Listener "${listener.event}@${listener.emitter}" was loaded.`
    );
  }
}
