import { Client, Message, PermissionResolvable } from 'discord.js';

import { Unit, createUnit } from '../unit/Unit';

type CommandOptions = {
  readonly aliases: readonly string[];
  readonly description: string;
  readonly args: readonly any[];
  readonly channelType: 'guild' | 'dm';
  readonly ownerOnly: boolean;
  readonly typing: boolean;
  readonly rerunOnEdit: boolean;
  readonly cooldown: number;
  readonly userPermissions:
    | PermissionResolvable
    | readonly PermissionResolvable[];
  readonly clientPermissions:
    | PermissionResolvable
    | readonly PermissionResolvable[];
};

const DEFAULT_OPTIONS: CommandOptions = {
  aliases: [],
  description: 'No description.',
  args: [],
  channelType: 'guild',
  ownerOnly: false,
  typing: true,
  rerunOnEdit: true,
  cooldown: 0,
  userPermissions: [],
  clientPermissions: [],
};

type CommandExecutor = (client: Client, message: Message, data: any) => void;

type Command = Unit & {
  name: string;
  aliases: readonly string[];
  description: string;
  args: readonly any[];
  channelType: 'guild' | 'dm';
  ownerOnly: boolean;
  typing: boolean;
  rerunOnEdit: boolean;
  cooldown: number;
  userPermissions: PermissionResolvable | readonly PermissionResolvable[];
  clientPermissions: PermissionResolvable | readonly PermissionResolvable[];
  executor: CommandExecutor;
};

export default Command;

export const createCommand = (
  id: string,
  name: string,
  options: CommandOptions = DEFAULT_OPTIONS,
  executor: CommandExecutor
): Command =>
  createUnit<Command>(id, {
    ...options,
    name,
    executor,
  });
