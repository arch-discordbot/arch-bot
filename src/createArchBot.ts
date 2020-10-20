import {
  AkairoClient,
  AkairoHandlerOptions,
  CommandHandler,
  ListenerHandler,
} from 'discord-akairo';
import mongoose from 'mongoose';

import * as config from './config';
import { Env, ShardData } from './types';
import { createShardLogger } from './utils/createLogger';

const createHandlerEnvOptions = (
  env: Env,
  directory: string
): AkairoHandlerOptions => ({
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
    env === 'production' ? await waitUntilShardData() : { id: 1 };
  const logger = createShardLogger(env, shardData.id);

  logger.debug('Received shard data %s', shardData);

  const client = new AkairoClient({
    ownerID: config.bot.ownerId,
    disableMentions: 'everyone',
  });
  client.shardData = shardData;
  client.logger = logger;
  client.mongoose = await mongoose.connect(
    `mongodb://${config.database.host}/${config.database.db}`,
    {
      user: config.database.user,
      pass: config.database.pass,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  );

  client.commandHandler = new CommandHandler(client, {
    ...createHandlerEnvOptions(env, 'commands'),
    prefix: ['a!', 'arch'],
    allowMention: true,
    blockBots: true,
    automateCategories: true,
  });

  client.listenerHandler = new ListenerHandler(
    client,
    createHandlerEnvOptions(env, 'listeners')
  );
  client.listenerHandler.setEmitters({
    commandHandler: client.commandHandler,
    listenerHandler: client.listenerHandler,
  });

  client.commandHandler.useListenerHandler(client.listenerHandler);

  client.listenerHandler.loadAll(
    `${client.listenerHandler.directory}/listenerHandler`
  );
  client.listenerHandler.loadAll(
    `${client.listenerHandler.directory}/commandHandler`
  );
  client.listenerHandler.loadAll(`${client.listenerHandler.directory}/client`);
  client.commandHandler.loadAll();

  return client;
};

export default createArchBot;
