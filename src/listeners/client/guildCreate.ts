import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

import { ArchGuildModel } from '../../database/models/ArchGuildModel';

export default class GuildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
    });
  }

  async exec(guild: Guild) {
    this.client.logger.debug(`Joined guild ID ${guild.id}`);

    const archGuild = await ArchGuildModel.findOrCreate(guild);

    this.client.logger.debug('archGuild: %s', archGuild);
  }
}
