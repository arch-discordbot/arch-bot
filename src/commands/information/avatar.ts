import { Argument, Command } from 'discord-akairo';
import { GuildMember, MessageEmbed, User } from 'discord.js';
import { getEmbedColor } from '../../utils/embeds';
import ArchMessage from '../../structures/ArchMessage';

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
    args: { target: GuildMember | User | string }
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

  buildEmbed(author: GuildMember, target: GuildMember | User) {
    const user = target instanceof GuildMember ? target.user : target;
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
