import { Command } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, User } from 'discord.js';

export default class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      channel: 'guild',
      args: [
        {
          id: 'target',
          type: 'user',
          default: (message: Message) => message.author,
        },
      ],
    });
  }

  async exec(message: Message, args: { target: User }) {
    if (!message.member || message.channel.type !== 'text') {
      return;
    }

    return message.channel.send(this.buildEmbed(message.member, args.target));
  }

  buildEmbed(_author: GuildMember, target: User) {
    const embed = new MessageEmbed();
    embed.setImage(target.displayAvatarURL({
      dynamic: true,
      size: 2048
    }));

    return embed;
  }
}
