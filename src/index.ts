import { ShardingManager } from 'discord.js';

import { bot, env } from './config';
import createArchBot from './createArchBot';
import { createShardManagerLogger } from './utils/createLogger';

const token = bot.token;
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
