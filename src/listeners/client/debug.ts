import { Listener } from 'discord-akairo';
import { bot } from '../../config';

export default class DebugListener extends Listener {
  constructor() {
    super('clientDebug', {
      event: 'debug',
      emitter: 'client',
    });
  }

  exec(message: string) {
    if (bot.discordJsDebug) {
      this.client.logger.debug(message);
    }
  }
}
