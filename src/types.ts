import { Client } from 'discord.js';
import mongoose from 'mongoose';
import winston from 'winston';
import ArchGuildMember from './structures/ArchGuildMember';

declare module 'discord-akairo' {
  interface AkairoClient extends Client {
    shardData: ShardData;
    logger: winston.Logger;
    mongoose: mongoose.Mongoose;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

declare module 'discord.js' {
  interface GuildMemberManager
    extends BaseManager<Snowflake, GuildMember, GuildMemberResolvable> {
    fetch(
      options:
        | UserResolvable
        | FetchMemberOptions
        | (FetchMembersOptions & { user: UserResolvable })
    ): Promise<ArchGuildMember>;
  }
}

export type Env = 'production' | 'development';

export type ShardData = {
  id: number;
};
