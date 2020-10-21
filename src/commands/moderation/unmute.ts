import { Command } from 'discord-akairo';
import { User } from 'discord.js';
import ArchMessage from '../../structures/ArchMessage';
import ArchGuildMember from '../../structures/ArchGuildMember';

export default class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [
        {
          id: 'target',
          description: 'The member to unmute.',
          type: 'member',
        },
      ],
    });
  }

  async exec(
    message: ArchMessage,
    args: { target: ArchGuildMember | User | string; reason: string }
  ) {
    const { guild, channel, member } = message;
    const { target } = args;

    if (!guild || channel.type !== 'text') {
      return;
    }

    if (!member || !member.hasPermission('MANAGE_MESSAGES')) {
      return;
    }

    if (!target) {
      return channel.send('Please specify a target user.');
    }

    if (!(target instanceof ArchGuildMember)) {
      return channel.send('The informed user is not valid.');
    }

    const guildConfig = await guild.fetchConfig();

    if (!guildConfig || !guildConfig.mutedRole) {
      return;
    }

    // TODO: error handling
    await target.roles.remove(
      guildConfig.mutedRole,
      `User unmuted by "${member.user}"`
    );

    return message.channel.send(`user was unmuted`);
  }
}
