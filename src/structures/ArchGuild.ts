import { Client, Guild } from 'discord.js';

class ArchGuild extends Guild {
  constructor(client: Client, data: object) {
    super(client, data);
  }
}

export default ArchGuild;
