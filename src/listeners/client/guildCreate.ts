import { Listener } from 'discord-akairo';

import { GuildConfigModel } from '../../database/models/GuildConfigModel';
import ArchGuild from '../../structures/ArchGuild';

export default class GuildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
    });
  }

  async exec(guild: ArchGuild) {
    this.client.logger.debug('Joined guild ID %s', guild.id);

    const guildConfig = await GuildConfigModel.findOrCreate(guild);

    this.client.logger.debug('guildConfig: %s', guildConfig);
  }
}
