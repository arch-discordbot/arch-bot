import { GuildMember, User } from 'discord.js';

export const getEmbedColor = (target: GuildMember | User, fallback: number) =>
  target instanceof GuildMember ? target.displayColor : fallback;
