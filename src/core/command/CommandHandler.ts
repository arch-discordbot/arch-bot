import { Client, Message } from 'discord.js';

import { UnitHandler, UnitHandlerOptions } from '../unit/UnitHandler';
import Command from './Command';

export type CommandHandlerOptions = UnitHandlerOptions & {
  readonly blockBots: boolean;
  readonly prefix: string;
  readonly allowMentionPrefix: boolean;
  readonly rerunOnEdit: boolean;
};

type CommandParseData = {
  command: Command;
  prefix: string;
  alias: string;
  argumentsString: string;
};

export class CommandHandler extends UnitHandler<Command> {
  readonly blockBots: boolean;
  readonly prefix: string;
  readonly allowMentionPrefix: boolean;
  readonly rerunOnEdit: boolean;

  constructor(client: Client, options: CommandHandlerOptions) {
    super(client, options);

    this.blockBots = options.blockBots;
    this.prefix = options.prefix;
    this.allowMentionPrefix = options.allowMentionPrefix;
    this.rerunOnEdit = options.rerunOnEdit;
  }

  initialize() {
    this.client.on('message', async (message) => {
      this.handleMessage(message.partial ? await message.fetch() : message);
    });

    if (this.rerunOnEdit) {
      this.client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.partial) oldMessage = await oldMessage.fetch();
        if (newMessage.partial) newMessage = await newMessage.fetch();
        if (newMessage.content !== oldMessage.content) {
          this.handleMessage(newMessage);
        }
      });
    }
  }

  private parseWithPrefix(
    message: Message,
    prefix: string
  ): CommandParseData | undefined {
    const msgContent = message.content;
    if (!msgContent.startsWith(prefix)) {
      return undefined;
    }

    const prefixEndIndex = msgContent.indexOf(prefix) + prefix.length;
    const argsStartIndex =
      msgContent.slice(prefixEndIndex).search(/\S/) + prefix.length;
    const alias = msgContent.slice(argsStartIndex).split(/\s+|\n+/)[0];
    const command = this.units.find((command) => command.name === alias);

    if (!command) {
      return undefined;
    }

    return {
      command,
      prefix,
      alias,
      argumentsString: msgContent
        .slice(argsStartIndex + alias.length + 1)
        .trim(),
    };
  }

  private parseCommandMultiplePrefix(
    message: Message,
    prefixes: string[]
  ): CommandParseData | undefined {
    return prefixes
      .map((prefix) => this.parseWithPrefix(message, prefix))
      .find(
        (parsedData) => typeof parsedData !== 'undefined' && parsedData.command
      );
  }

  private parseCommand(message: Message): CommandParseData | undefined {
    const prefixes = [this.prefix];
    if (this.allowMentionPrefix) {
      if (!this.client.user) {
        throw new Error(`Client not yet initialized.`);
      }
      prefixes.push(`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`);
    }

    return this.parseCommandMultiplePrefix(message, prefixes);
  }

  private handleMessage(message: Message) {
    const parsedCommandData = this.parseCommand(message);

    if (typeof parsedCommandData !== 'undefined') {
      const { command, ...data } = parsedCommandData;

      try {
        command.executor(this.client, message, data);
        this.emit('commandExecuted', command, data);
      } catch (error: any) {
        this.emit('commandError', error, command, data);
      }
    }
  }
}
