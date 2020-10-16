import { Command } from 'discord-akairo';
import { Client, Message, MessageEmbed } from 'discord.js';
import { formatDate, formatNumber } from '../utils/formatting';
import { env } from '../config';

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

    const guildsCount = await this.calculateGuildCount();
    const usersCount = await this.calculateUserCount();

    embed.addField(
      'Shard',
      `${this.client.shardData.id}/${this.client.shard?.count || 1}`,
      true
    );
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
    embed.addField('Environment', env === 'production' ? 'PROD' : 'DEV', true);

    return embed;
  }

  async calculateGuildCount() {
    let count: number;

    if (this.client.shard !== null) {
      const values = await this.client.shard.fetchClientValues(
        'guilds.cache.size'
      );
      count = values.reduce((value, next) => value + next, 0);
    } else {
      count = this.client.guilds.cache.size;
    }

    return count;
  }

  async calculateUserCount() {
    let count: number;

    const countGuildMembers = (client: Client) =>
      client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0);

    if (this.client.shard !== null) {
      const values = await this.client.shard.broadcastEval(`
        (${countGuildMembers.toString()})(this)
      `);
      count = values.reduce((value, next) => value + next, 0);
    } else {
      count = countGuildMembers(this.client);
    }

    return count;
  }
}
