import { Structures } from 'discord.js';
import ArchGuild from './ArchGuild';

export const initializeStructures = () => {
  Structures.extend('Guild', () => ArchGuild);
};
