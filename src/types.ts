import winston from 'winston';
import mongoose from 'mongoose';
import { CommandHandler } from './core/command/CommandHandler';
import { EventListenerHandler } from './core/eventListener/EventListenerHandler';

declare module 'discord.js' {
  interface Client extends BaseClient {
    logger: winston.Logger;
    mongoose: mongoose.Mongoose;
    commandHandler: CommandHandler;
    eventListenerHandler: EventListenerHandler;
  }
}

export type Env = 'production' | 'development';

export type ShardData = {
  id: number;
};
