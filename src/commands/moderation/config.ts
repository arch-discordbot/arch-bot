import { ArgumentOptions, Command } from 'discord-akairo';
import { Role } from 'discord.js';
import { GuildConfigModel } from '../../database/models/GuildConfigModel';
import ArchMessage from '../../structures/ArchMessage';

export default class ConfigCommand extends Command {
  constructor() {
    super('config', {
      aliases: ['config'],
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      argumentDefaults: {
        prompt: {
          timeout: 'Time ran out, command has been cancelled.',
          retries: 3,
        },
      },
    });
  }

  *args() {
    const args: Record<string, unknown> = {};

    args.prefix = yield <ArgumentOptions>{
      type: 'string',
      prompt: {
        start: 'What prefix should I listen for?',
        retry: 'Invalid prefix, try again.',
      }
    };

    args.mutedRole = yield <ArgumentOptions>{
      type: 'roleMention',
      prompt: {
        start: 'What role should the mute command use to mute members?',
        retry: 'Invalid role, try again.',
      },
    };

    console.log(typeof args.prefix);

    return args;
  }

  async exec(message: ArchMessage, args: { mutedRole: Role | null }) {
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
