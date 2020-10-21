import { Guild } from 'discord.js';
import {
  GuildConfig,
  GuildConfigModel,
} from '../database/models/GuildConfigModel';
import { AkairoClient } from 'discord-akairo';

class ArchGuild extends Guild {
  config: GuildConfig | null = null;

  constructor(client: AkairoClient, data: object) {
    super(client, data);
    this.fetchConfig(true).catch((error) => {
      client.logger.error({
        message: 'Error fetching guild config from "%s"',
        splat: [this.id],
        stack: error,
      });
    });
  }

  async fetchConfig(force = false) {
    if (!force && this.config) {
      return this.config;
    }

    this.config = await GuildConfigModel.findOrCreate(this);
    return this.config;
  }
}

export default ArchGuild;
