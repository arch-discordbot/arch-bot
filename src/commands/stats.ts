import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { formatDate, formatNumber } from '../utils/formatting';

export default class StatsCommand extends Command {
  constructor() {
    super('stats', {
      aliases: ['stats'],
      channel: 'guild',
    });
  }

  async exec(message: Message) {
    message.channel.send(await this.buildEmbed());
  }

  async buildEmbed() {
    const embed = new MessageEmbed();

    const commandsCount = this.client.commandHandler.modules.size;
    const memoryUsage = process.memoryUsage().heapUsed / (1024 * 1024);

    if (this.client.readyAt) {
      embed.setDescription(`Online since ${formatDate(this.client.readyAt)}`);
    }

    const guildsCount = await this.countClientProperty('guilds.cache.size');
    const usersCount = await this.countClientProperty('users.cache.size');

    embed.addField('Shard', this.client.shardData.id, true);
    embed.addField('Commands', commandsCount, true);
    embed.addField('RAM', `${formatNumber(memoryUsage)} MB`, true);
    embed.addField(
      'Guilds',
      formatNumber(guildsCount, undefined, { maximumFractionDigits: 0 }),
      true
    );
    embed.addField(
      'Users',
      formatNumber(usersCount, undefined, { maximumFractionDigits: 0 }),
      true
    );

    return embed;
  }

  async countClientProperty(path: string) {
    let count: number;

    if (this.client.shard !== null) {
      const values = await this.client.shard.fetchClientValues(path);
      count = values.reduce((value, next) => value + next, 0);
    } else {
      count = path
        .split('.')
        .reduce(
          (obj: any, prop) => (obj && obj[prop] ? obj[prop] : null),
          this.client
        );
    }

    return count;
  }
}
