import { GuildMember } from 'discord.js';
import ArchGuild from './ArchGuild';
import { AkairoClient } from 'discord-akairo';

class ArchGuildMember extends GuildMember {
  guild!: ArchGuild;

  constructor(client: AkairoClient, data: object, guild: ArchGuild) {
    super(client, data, guild);
  }
}

export default ArchGuildMember;
