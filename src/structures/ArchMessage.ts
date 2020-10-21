import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';
import ArchGuild from './ArchGuild';
import { AkairoClient } from 'discord-akairo';
import ArchGuildMember from './ArchGuildMember';

class ArchMessage extends Message {
  guild!: ArchGuild | null;
  member!: ArchGuildMember | null;

  constructor(
    client: AkairoClient,
    data: object,
    channel: TextChannel | DMChannel | NewsChannel
  ) {
    super(client, data, channel);
  }
}

export default ArchMessage;
