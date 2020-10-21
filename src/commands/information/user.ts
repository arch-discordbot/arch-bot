import { Argument, Command } from 'discord-akairo';
import { GuildMember, ImageSize, MessageEmbed, User } from 'discord.js';
import { stripIndents } from 'common-tags';
import { formatDate } from '../../utils/formatting';
import { getEmbedColor } from '../../utils/embeds';
import { formatDistanceToNow } from 'date-fns';
import ArchGuild from '../../structures/ArchGuild';
import ArchMessage from '../../structures/ArchMessage';

export default class UserCommand extends Command {
  constructor() {
    super('user', {
      aliases: ['user', 'userinfo'],
      channel: 'guild',
      args: [
        {
          id: 'target',
          type: Argument.union('member', 'user', 'string'),
          default: (message: ArchMessage) => message.member || message.author,
        },
        {
          id: 'targetGuild',
          type: 'guild',
          default: () => null,
        },
      ],
      typing: true,
    });
  }

  async exec(
    message: ArchMessage,
    args: { target: GuildMember | User | string; targetGuild: ArchGuild | null }
  ) {
    const { member, channel } = message;
    let { target, targetGuild } = args;

    if (
      !member ||
      channel.type !== 'text' ||
      (targetGuild && !this.client.isOwner(member))
    ) {
      return;
    }

    if (targetGuild) {
      try {
        target = await targetGuild.members.fetch({
          user: target,
          force: true,
          cache: false,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // TODO: fetch not cached members/users.
    if (typeof target === 'string') {
      return channel.send('User not found.');
    }

    return channel.send(await this.buildEmbed(member, target));
  }

  async buildEmbed(author: GuildMember, target: GuildMember | User) {
    const targetUser = target instanceof GuildMember ? target.user : target;
    const embed = new MessageEmbed();
    embed.setColor(getEmbedColor(target, author.displayColor));
    embed.setThumbnail(
      targetUser.displayAvatarURL({
        size: 2048,
        dynamic: true,
      })
    );

    embed.addField(
      'Account information',
      stripIndents`
        **ID:** ${targetUser.id}
        **Username:** ${targetUser.username}#${targetUser.discriminator}
        **Creation date:** ${formatDate(
          targetUser.createdAt
        )} (${formatDistanceToNow(targetUser.createdAt, { addSuffix: true })})
        **Avatar URLs:** ${this.buildAvatarUrls(targetUser).join(' ')}
      `
    );

    if (target instanceof GuildMember) {
      const infos: string[] = [];

      if (target.guild.ownerID === target.id) {
        infos.push(`
          This user owns this guild.
          **Creation date:** ${formatDate(
            target.guild.createdAt
          )} (${formatDistanceToNow(target.guild.createdAt)})`);
      } else if (target.joinedAt) {
        infos.push(
          `**Join date:** ${formatDate(
            target.joinedAt!
          )} (**#${this.calculatePosition(
            target,
            'joinedTimestamp'
          )}**) (${formatDistanceToNow(target.joinedAt)})`
        );
      }

      if (target.nickname) {
        infos.push(`
          **Nickname:** ${target.nickname}`);
      }

      if (target.premiumSince) {
        infos.push(`
          **Boost date:** ${formatDate(
            target.premiumSince
          )} (**#${this.calculatePosition(
          target,
          'premiumSinceTimestamp'
        )}**) (${formatDistanceToNow(target.premiumSince)})`);
      }

      if (target.roles.cache.size > 0) {
        const roles = target.roles.cache.map((role) =>
          author.guild.id === target.guild.id ? role.toString() : role.name
        );
        infos.push(`\n
          **Roles:** ${roles.join(', ')}`);
      }

      embed.addField('Guild member information', stripIndents(infos.join('')));
    }

    return embed;
  }

  buildAvatarUrls(user: User) {
    const sizes: ImageSize[] = [128, 256, 512, 1024, 2048, 4096];
    return sizes.map(
      (size) =>
        `[[${size}x](${user.displayAvatarURL({
          dynamic: true,
          size: size,
          format: 'png',
        })})]`
    );
  }

  calculatePosition(member: GuildMember, property: keyof GuildMember) {
    return (
      member.guild.members.cache
        .filter((guildMember) => {
          const value = guildMember[property];
          return typeof value === 'number' && value > 0;
        })
        .map((guildMember) => ({
          id: guildMember.id,
          value: guildMember[property] as number,
        }))
        .sort((first, second) => first.value - second.value)
        .findIndex((guildMember) => guildMember.id === member.id) + 1
    );
  }
}
