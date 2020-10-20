import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { formatNumber } from '../../utils/formatting';

export default class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
    });
  }

  async exec(message: Message) {
    const pingMessage = await message.channel.send('Pinging...');
    const diff =
      (pingMessage.editedAt || pingMessage.createdAt).getTime() -
      (message.editedAt || message.createdAt).getTime();

    const embed = new MessageEmbed();
    embed.addField('API', `${formatNumber(diff)}ms`, true);
    embed.addField(
      'WS',
      `${formatNumber(Math.floor(this.client.ws.ping))}ms`,
      true
    );

    return pingMessage.edit({
      content: 'Pong!',
      embed,
    });
  }
}
