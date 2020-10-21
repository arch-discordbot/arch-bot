import { Command } from 'discord-akairo';
import { Message, Role } from 'discord.js';
import { GuildConfigModel } from '../../database/models/GuildConfigModel';

export default class ConfigCommand extends Command {
  constructor() {
    super('config', {
      aliases: ['config'],
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'mutedRole',
          type: 'roleMention',
          prompt: {
            start: 'What role should the mute command use to mute members?',
            retry: 'Invalid role, try again.',
          },
        },
      ],
      argumentDefaults: {
        prompt: {
          timeout: 'Time ran out, command has been cancelled.',
          retries: 3,
        },
      },
    });
  }

  async exec(message: Message, args: { mutedRole: Role | null }) {
    const { guild } = message;

    if (!guild) {
      return;
    }

    const guildConfig = await GuildConfigModel.findOrCreate(guild);
    guildConfig.mutedRole = args.mutedRole?.id;
    await guildConfig.save();

    return message.channel.send('Guild config has been updated.');
  }
}
