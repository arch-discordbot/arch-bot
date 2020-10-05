import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

import { ArchGuildModel } from '../../models/ArchGuildModel';

export default class GuildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      event: 'guildCreate',
      emitter: 'client',
    });
  }

  async exec(guild: Guild) {
    this.client.logger.debug(`Joined guild ID ${guild.id}`);

    const archGuild = await ArchGuildModel.findOneAndUpdate(
      { _id: guild.id },
      {
        $set: {
          _id: guild.id,
          name: guild.name,
        },
        $setOnInsert: {
          prefix: 'a!',
        },
      },
      { upsert: true, new: true }
    );

    this.client.logger.debug('archGuild: %s', archGuild);
  }
}
