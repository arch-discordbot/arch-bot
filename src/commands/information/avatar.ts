import { Argument, Command } from 'discord-akairo';
import { MessageEmbed, User } from 'discord.js';
import { getEmbedColor } from '../../utils/embeds';
import ArchMessage from '../../structures/ArchMessage';
import ArchGuildMember from '../../structures/ArchGuildMember';

export default class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      channel: 'guild',
      args: [
        {
          id: 'target',
          type: Argument.union('member', 'user', 'string'),
          default: (message: ArchMessage) => message.author,
        },
      ],
    });
  }

  async exec(
    message: ArchMessage,
    args: { target: ArchGuildMember | User | string }
  ) {
    if (!message.member || message.channel.type !== 'text') {
      return;
    }

    const { member, channel } = message;

    // TODO: fetch not cached members/users.
    if (typeof args.target === 'string') {
      return channel.send('User not found.');
    }

    return channel.send(this.buildEmbed(member, args.target));
  }

  buildEmbed(author: ArchGuildMember, target: ArchGuildMember | User) {
    const user = target instanceof ArchGuildMember ? target.user : target;
    const embed = new MessageEmbed();
    embed.setColor(getEmbedColor(target, author.displayColor));
    embed.setImage(
      user.displayAvatarURL({
        dynamic: true,
        size: 2048,
      })
    );

    return embed;
  }
}
