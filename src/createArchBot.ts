import { Client } from 'discord.js';
import mongoose from 'mongoose';

import { CommandHandler } from './core/command/CommandHandler';
import { EventListenerHandler } from './core/eventListener/EventListenerHandler';
import { UnitHandlerOptions } from './core/unit/UnitHandler';
import { createShardLogger } from './utils/createLogger';
import { Env, ShardData } from './types';

const createHandlerEnvOptions = (
  env: Env,
  directory: string
): UnitHandlerOptions => ({
  extensions: env === 'production' ? ['.js'] : ['.ts'],
  directory: env === 'production' ? `build/${directory}` : `src/${directory}`,
});

const waitUntilShardData = (): Promise<ShardData> =>
  new Promise((resolve) => {
    process.once('message', (message) => {
      const { type, ...data } = message;
      if (type === 'shardData') {
        resolve(data);
      }
    });
  });

const createArchBot = async (env: Env) => {
  const shardData: ShardData =
    env === 'production' ? await waitUntilShardData() : { id: 0 };
  const logger = createShardLogger(env, shardData.id);

  logger.debug('Received shard data %s', shardData);

  const client = new Client();
  client.logger = logger;
  client.mongoose = await mongoose.connect(
    `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`,
    {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  );

  client.commandHandler = new CommandHandler(client, {
    ...createHandlerEnvOptions(env, 'commands'),
    blockBots: true,
    allowMentionPrefix: true,
    prefix: '!',
    rerunOnEdit: true,
  });

  client.commandHandler.on('unitLoaded', (unit) => {
    client.logger.debug(`Command "${unit.id}' was loaded.`);
  });

  client.commandHandler.on('commandExecuted', (command) => {
    client.logger.debug(`Command "${command.id}" was executed.`);
  });

  await client.commandHandler.loadAll();
  client.commandHandler.initialize();

  client.eventListenerHandler = new EventListenerHandler(
    client,
    createHandlerEnvOptions(env, 'eventListeners')
  );

  client.eventListenerHandler.on('unitLoaded', (unit) => {
    client.logger.debug(`Event listener "${unit.id}" was loaded.`);
  });

  await client.eventListenerHandler.loadAll();

  return client;
};

export default createArchBot;
