import { Listener } from 'discord-akairo';

export default class LoadListener extends Listener {
  constructor() {
    super('commandError', {
      event: 'error',
      emitter: 'commandHandler',
    });
  }

  exec(error: Error) {
    this.client.logger.error(
      'An error occurred while executing a command.',
      error
    );
  }
}
