import { EventEmitter } from 'events';
import pathUtils from 'path';

import { Client } from 'discord.js';

import listFilesRecursive from '../utils/listFilesRecursive';

type CommandManagerOptions = {
  readonly directory: string;
};

const createCommandManager = (
  _client: Client,
  options: CommandManagerOptions
) => {
  const events = new EventEmitter();

  const load = async (path: string) => {
    const m = await import(pathUtils.resolve(path));
    console.log(m);
  };

  const loadAll = () => {
    const commands = listFilesRecursive(options.directory);
    commands.forEach(load);
  };

  return {
    events,
    loadAll,
  };
};

export default createCommandManager;
