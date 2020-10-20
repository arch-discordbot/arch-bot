import { Command } from 'discord-akairo';
import {
  Guild,
  GuildMember,
  ImageSize,
  Message,
  MessageEmbed,
} from 'discord.js';
import { stripIndents } from 'common-tags';
import { formatDate } from '../utils/formatting';
import { formatDistanceToNow } from 'date-fns';

export default class GuildCommand extends Command {
  constructor() {
    super('guild', {
      aliases: ['guild', 'guildinfo'],
      channel: 'guild',
      typing: true,
    });
  }

  async exec(message: Message) {
    if (!message.member || !message.guild || message.channel.type !== 'text') {
      return;
    }

    return message.channel.send(
      await this.buildEmbed(message.member, message.guild)
    );
  }

  async buildEmbed(_author: GuildMember, target: Guild) {
    const embed = new MessageEmbed();
    embed.setTitle(target.name);

    if (target.icon) {
      embed.setThumbnail(
        target.iconURL({
          size: 2048,
          dynamic: true,
        })!
      );
    }

    const infos: string[] = [];

    infos.push(`
      **ID:** ${target.id}
      **Name:** ${target.name}
      **Creation date:** ${formatDate(target.createdAt)} (${formatDistanceToNow(
      target.createdAt
    )})
      **Region:** ${target.region.toUpperCase()}
      **Members:** ${this.calculateMemberCount(target)}`);

    if (target.icon) {
      infos.push(`
        **Icon URLs:** ${this.buildUrls(target, 'iconURL').join(' ')}`);
    } else {
      infos.push(`
        **Acronym:** ${target.nameAcronym}`);
    }

    if (target.banner) {
      infos.push(`
        **Banner URLs:** ${this.buildUrls(target, 'bannerURL').join(' ')}`);
    }

    infos.push(`
      **Boost tier:** ${target.premiumTier}/3 (**${
      target.premiumSubscriptionCount || 0
    }**)`);

    embed.setDescription(stripIndents(infos.join('')));

    if (target.roles.cache.size > 0) {
      const roles = target.roles.cache.map((role) => role.toString());
      embed.addField('Roles', roles.join());
    }

    return embed;
  }

  buildUrls(guild: Guild, property: 'iconURL' | 'bannerURL') {
    const sizes: ImageSize[] = [128, 256, 512, 1024, 2048, 4096];
    return sizes.map(
      (size) =>
        `[[${size}x](${guild[property]({
          dynamic: true,
          size: size,
          format: 'png',
        })})]`
    );
  }

  calculateMemberCount(guild: Guild) {
    return guild.memberCount;
  }
}
