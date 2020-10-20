import {
  Client,
  DMChannel,
  Message,
  NewsChannel,
  TextChannel,
} from 'discord.js';
import ArchGuild from './ArchGuild';

class ArchMessage extends Message {
  guild!: ArchGuild | null;

  constructor(
    client: Client,
    data: object,
    channel: TextChannel | DMChannel | NewsChannel
  ) {
    super(client, data, channel);
  }
}

export default ArchMessage;
