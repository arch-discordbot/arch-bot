import { Client } from 'discord.js';
import mongoose from 'mongoose';
import winston from 'winston';

declare module 'discord-akairo' {
  interface AkairoClient extends Client {
    logger: winston.Logger;
    mongoose: mongoose.Mongoose;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

export type Env = 'production' | 'development';

export type ShardData = {
  id: number;
};
