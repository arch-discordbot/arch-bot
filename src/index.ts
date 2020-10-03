import { ShardingManager } from 'discord.js';
import dotEnvExtended from 'dotenv-extended';

import createArchBot from './createArchBot';
import { createShardManagerLogger } from './utils/createLogger';

dotEnvExtended.load({
  errorOnMissing: true,
  errorOnRegex: true,
});

const env =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const token = process.env.DISCORD_TOKEN;
const mode = process.argv.includes('shard_manager') ? 'shard_manager' : 'shard';

const startSharding = () => {
  const logger = createShardManagerLogger(env);

  let file: string;
  const execArgv: string[] = [];

  if (env === 'production') {
    file = './build/index.js';
  } else {
    file = './src/index.ts';
    execArgv.push('-r', 'ts-node/register');
  }

  const manager = new ShardingManager(file, {
    shardArgs: ['shard'],
    execArgv,
    token,
    totalShards: 3,
  });

  manager.on('shardCreate', (shard) => {
    logger.info('Created shard %s', shard.id);

    if (env === 'production') {
      shard.on('spawn', () =>
        shard.send({
          type: 'shardData',
          id: shard.id,
        })
      );
    }
  });

  manager.spawn().catch((err) => {
    logger.error('An error occurred while spawning the shards.', err);
  });
};

const startBot = () => createArchBot(env).then((client) => client.login(token));

if (mode === 'shard_manager') {
  startSharding();
} else {
  startBot();
}
