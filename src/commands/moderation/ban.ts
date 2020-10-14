import { Argument, Command } from 'discord-akairo';
import { GuildMember, Message, User } from 'discord.js';

export default class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban'],
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'target',
          description: 'The user to ban.',
          type: Argument.union('member', 'user', 'string'),
        },
      ],
    });
  }

  exec(message: Message, args: { target: GuildMember | User | string | null }) {
    const { channel, member } = message;

    if (!member!.hasPermission('BAN_MEMBERS')) {
      return channel.send('no permissions');
    }

    if (!args.target) {
      return channel.send('Please specify a target');
    }

    return channel.send(`user was banned`);
  }
}
