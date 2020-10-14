import { Argument, Command } from 'discord-akairo';
import { GuildMember, Message, MessageEmbed, User } from 'discord.js';

export default class UserCommand extends Command {
  constructor() {
    super('user', {
      aliases: ['user', 'userinfo'],
      channel: 'guild',
      args: [
        {
          id: 'target',
          type: Argument.union('member', 'user'),
          default: (message: Message) => message.member || message.author,
        },
      ],
    });
  }

  async exec(message: Message, args: { target: GuildMember | User }) {
    const author = message.member!;
    message.channel.send(await this.buildEmbed(author, args.target));
  }

  async buildEmbed(author: GuildMember, target: GuildMember | User) {
    const embed = new MessageEmbed();

    embed.setColor(this.resolveColor(author, target));
    embed.setDescription(
      target instanceof GuildMember ? target.displayName : target.username
    );

    return embed;
  }

  resolveColor(author: GuildMember, target: GuildMember | User) {
    return target instanceof GuildMember
      ? target.displayColor
      : author.displayColor;
  }
}
