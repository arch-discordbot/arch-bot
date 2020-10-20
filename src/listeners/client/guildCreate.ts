import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

import { GuildConfigModel } from '../../database/models/GuildConfigModel';

export default class GuildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
    });
  }

  async exec(guild: Guild) {
    this.client.logger.debug('Joined guild ID %s', guild.id);

    const guildConfig = await GuildConfigModel.findOrCreate(guild);

    this.client.logger.debug('guildConfig: %s', guildConfig);
  }
}
