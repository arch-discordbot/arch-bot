import { Argument, Command } from 'discord-akairo';
import { Guild, Message } from 'discord.js';
import { ArchGuildModel } from '../../database/models/ArchGuildModel';

export default class GuildConfigCommand extends Command {
  constructor() {
    super('guild-config', {
      aliases: ['guild-config', 'guildconfig', 'gc'],
      args: [
        {
          id: 'target',
          type: Argument.union('guild', 'string'),
          default: (message: Message) =>
            message.channel.type === 'text' ? message.guild : null,
        },
      ],
      ownerOnly: true,
    });
  }

  async exec(message: Message, args: { target: Guild | string }) {
    const { target } = args;

    if (!target) {
      return;
    }

    const guildId = target instanceof Guild ? target.id : target;
    const config = await ArchGuildModel.findById(guildId);

    try {
      const dmChannel = await message.author.createDM();
      dmChannel.send({
        content: JSON.stringify(config, undefined, 2),
        code: true,
      });
      await dmChannel.delete();

      if (message.channel.type === 'text') {
        await message.channel.send('The guild config was sent to your DM.');
      }
    } catch (error: unknown) {
      this.client.logger.error({
        message:
          'An error occurred while trying to send the guild config from "%s" to the user %s',
        splat: [guildId, message.author.id],
        stack: error,
      });
    }
  }
}
