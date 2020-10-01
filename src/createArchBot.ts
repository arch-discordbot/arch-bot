import { Client } from 'discord.js';
import mongoose from 'mongoose';
import winston from 'winston';

import { CommandHandler } from './core/command/CommandHandler';
import { EventListenerHandler } from './core/eventListener/EventListenerHandler';
import { UnitHandlerOptions } from './core/unit/UnitHandler';
import { createLogger } from './utils/createLogger';

declare module 'discord.js' {
  interface Client extends BaseClient {
    logger: winston.Logger;
    mongoose: mongoose.Mongoose;
    commandHandler: CommandHandler;
    eventListenerHandler: EventListenerHandler;
  }
}

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
      if (message.type === 'shardData') {
        resolve(message);
      }
    });
  });

const createArchBot = async (env: Env) => {
  const shardData: ShardData =
    env === 'production' ? await waitUntilShardData() : { id: 0 };

  const client = new Client();
  client.logger = createLogger(env, shardData.id);
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
    console.log('command was loaded', unit.id);
  });

  client.commandHandler.on('commandExecuted', (command) => {
    console.log('command executed', command.name);
  });

  await client.commandHandler.loadAll();
  client.commandHandler.initialize();

  client.eventListenerHandler = new EventListenerHandler(
    client,
    createHandlerEnvOptions(env, 'eventListeners')
  );

  client.eventListenerHandler.on('unitLoaded', (unit) => {
    console.log('event listener was loaded', unit.id);
  });

  client.eventListenerHandler.on('unitUnloaded', (unit) => {
    console.log('event listener was unloaded', unit.id);
  });

  await client.eventListenerHandler.loadAll();

  return client;
};

export default createArchBot;
