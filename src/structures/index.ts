import { Structures } from 'discord.js';
import ArchGuild from './ArchGuild';
import ArchMessage from './ArchMessage';
import ArchGuildMember from './ArchGuildMember';

export const initializeStructures = () => {
  Structures.extend('Guild', () => ArchGuild);
  Structures.extend('GuildMember', () => ArchGuildMember);
  Structures.extend('Message', () => ArchMessage);
};
