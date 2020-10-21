import { Command, Listener } from 'discord-akairo';
import ArchMessage from '../../structures/ArchMessage';

export default class LoadListener extends Listener {
  constructor() {
    super('commandStarted', {
      event: 'commandStarted',
      emitter: 'commandHandler',
    });
  }

  exec(_: ArchMessage, command: Command) {
    this.client.logger.debug('Command "%s" was executed.', command.id);
  }
}
