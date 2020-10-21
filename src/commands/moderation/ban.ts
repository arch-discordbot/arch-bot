import { Argument, Command } from 'discord-akairo';
import { User } from 'discord.js';
import ArchMessage from '../../structures/ArchMessage';
import ArchGuildMember from '../../structures/ArchGuildMember';

export default class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban'],
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'target',
          description: 'The user to ban.',
          type: Argument.union('member', 'user', 'string'),
        },
      ],
    });
  }

  async exec(
    message: ArchMessage,
    args: { target: ArchGuildMember | User | string | null }
  ) {
    if (!message.guild || message.channel.type !== 'text') {
      return;
    }

    const { guild, channel, member } = message;
    const { target } = args;

    if (!member) {
      return;
    }

    if (!member.hasPermission('BAN_MEMBERS')) {
      return;
    }

    if (!target) {
      return channel.send('Please specify a target user.');
    }

    if (target instanceof ArchGuildMember) {
      if (!target.bannable) {
        return channel.send(
          "I don't have enough permissions to ban this guild member."
        );
      }
    }

    try {
      await guild.members.ban(target, {
        reason: `Banned by ${member.toString()} with reason "none"`,
      });
    } catch (error: any) {
      this.client.logger.error({
        message: 'An error occurred while trying to ban the user %s',
        splat: [typeof target === 'string' ? target : target.id],
        stack: error,
      });

      return channel.send('An error occurred while trying to ban this user.');
    }

    return channel.send(`user was banned`);
  }
}
