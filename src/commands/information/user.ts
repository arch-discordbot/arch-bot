import { Argument, Command } from 'discord-akairo';
import {
  GuildMember,
  ImageSize,
  Message,
  MessageEmbed,
  User,
} from 'discord.js';
import { inlineLists, stripIndents } from 'common-tags';
import { formatDate } from '../../utils/formatting';
import { getEmbedColor } from '../../utils/embeds';
import { formatDistanceToNow } from 'date-fns';

export default class UserCommand extends Command {
  constructor() {
    super('user', {
      aliases: ['user', 'userinfo'],
      channel: 'guild',
      args: [
        {
          id: 'target',
          type: Argument.union('member', 'user', 'string'),
          default: (message: Message) => message.member || message.author,
        },
      ],
      typing: true,
    });
  }

  async exec(message: Message, args: { target: GuildMember | User | string }) {
    if (!message.member || message.channel.type !== 'text') {
      return;
    }

    const { channel } = message;
    let { target } = args;

    // TODO: fetch not cached members/users.
    if (typeof target === 'string') {
      return channel.send('User not found.');
    }

    return channel.send(await this.buildEmbed(message.member, target));
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
      stripIndents(inlineLists`
        **ID:** ${targetUser.id}
        **Username:** ${targetUser.username}#${targetUser.discriminator}
        **Creation date:** ${formatDate(
          targetUser.createdAt
        )} (${formatDistanceToNow(targetUser.createdAt, { addSuffix: true })})
        **Avatar URLs:** ${this.buildAvatarUrls(targetUser)}
      `)
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
        const roles = target.roles.cache.map((role) => role.toString());
        infos.push(`\n
          **Roles:** ${roles}`);
      }

      embed.addField(
        'Guild member information',
        stripIndents(inlineLists(infos.join('')))
      );
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
