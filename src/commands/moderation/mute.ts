import { Command } from 'discord-akairo';
import { GuildMember, Message, User } from 'discord.js';
import {
  Punishment,
  PunishmentModel,
  PunishmentType,
} from '../../database/models/PunishmentModel';
import { GuildConfigModel } from '../../database/models/GuildConfigModel';

export default class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [
        {
          id: 'target',
          description: 'The member to mute.',
          type: 'member',
        },
        {
          id: 'reason',
          description: 'Punishment reason.',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(
    message: Message,
    args: { target: GuildMember | User | string; reason: string }
  ) {
    const { guild, channel, member } = message;
    const { target } = args;
    let { reason } = args;

    if (!guild || channel.type !== 'text') {
      return;
    }

    if (!member || !member.hasPermission('MANAGE_MESSAGES')) {
      return;
    }

    if (!target) {
      return channel.send('Please specify a target user.');
    }

    if (!(target instanceof GuildMember)) {
      return channel.send('The informed user is not valid.');
    }

    const guildConfig = await GuildConfigModel.findById(guild.id);

    if (!guildConfig || !guildConfig.mutedRole) {
      return;
    }

    // TODO: error handling
    await target.roles.add(
      guildConfig.mutedRole,
      `User muted by "${member.user}"`
    );

    const punishment = new Punishment();
    punishment.guild = guild.id;
    punishment.punisher = member.id;
    punishment.user = target.id;
    punishment.type = PunishmentType.MUTE;
    punishment.reason = reason;
    await PunishmentModel.create(punishment);

    return message.channel.send(`user was muted`);
  }
}
