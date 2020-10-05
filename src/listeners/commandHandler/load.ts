import { Command, Listener } from 'discord-akairo';

export default class LoadListener extends Listener {
  constructor() {
    super('commandLoad', {
      event: 'load',
      emitter: 'commandHandler',
    });
  }

  exec(command: Command) {
    this.client.logger.debug(`Command "${command.id}" was loaded.`);
  }
}
