import { Argument, Command } from 'discord-akairo';
import { DMChannel, NewsChannel, TextChannel } from 'discord.js';

import { GuildConfigModel } from '../../database/models/GuildConfigModel';
import ArchGuild from '../../structures/ArchGuild';
import ArchMessage from '../../structures/ArchMessage';

export default class GuildConfigCommand extends Command {
  constructor() {
    super('guild-config', {
      aliases: ['guild-config', 'guildconfig', 'gc'],
      args: [
        {
          id: 'target',
          type: Argument.union('guild', 'string'),
          default: (message: ArchMessage) =>
            message.channel.type === 'text' ? message.guild : null,
        },
        {
          id: 'here',
          match: 'flag',
          flag: '--here'
        }
      ],
      ownerOnly: true,
    });
  }

  async exec(message: ArchMessage, args: { target: ArchGuild | string, here: boolean }) {
    const { here, target } = args;

    if (!target) {
      return;
    }

    const guildId = target instanceof ArchGuild ? target.id : target;
    const config = await GuildConfigModel.findById(guildId);

    let channel: DMChannel | TextChannel | NewsChannel;

    if (!here) {
      try {
        channel = await message.author.createDM();
      } catch (error: unknown) {
        this.client.logger.error({
          message:
            'An error occurred while trying to send the guild config from "%s" to the user %s',
          splat: [guildId, message.author.id],
          stack: error,
        });
        return;
      }
    } else {
      channel = message.channel;
    }

    channel.send({
      content: JSON.stringify(config, undefined, 2),
      code: 'json',
    });

    if (channel instanceof DMChannel) {
      await channel.delete();
    }

    if (!here && message.channel.type === 'text') {
      await message.channel.send('The guild config was sent to your DM.');
    }
  }
}
