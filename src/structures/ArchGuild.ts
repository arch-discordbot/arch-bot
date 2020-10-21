import { Client, Guild } from 'discord.js';
import { GuildConfig } from '../database/models/GuildConfigModel';

class ArchGuild extends Guild {
  config?: GuildConfig;

  constructor(client: Client, data: object) {
    super(client, data);
  }
}

export default ArchGuild;
