import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class LoadListener extends Listener {
  constructor() {
    super('commandStarted', {
      event: 'commandStarted',
      emitter: 'commandHandler',
    });
  }

  exec(_: Message, command: Command) {
    this.client.logger.debug(`Command "${command.id}" was executed.`);
  }
}
