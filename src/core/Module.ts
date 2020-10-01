import { Client } from 'discord.js';

export type Module = {
  client?: Client;
  id: string;
  name: string;
};

export const createModule = (
  client: Client,
  id: string,
  name: string
): Module =>
  ({
    client,
    id,
    name,
  } as Module);
