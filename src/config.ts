import dotEnvExtended from 'dotenv-extended';

import { Env } from './types';

dotEnvExtended.load({
  errorOnMissing: true,
  errorOnRegex: true,
});

export const env: Env =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const bot = {
  token: process.env.DISCORD_TOKEN,
  ownerId: process.env.OWNER_ID,
};

export const database = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  db: process.env.MONGO_DB,
};
