import { Format } from 'logform';
import winston, { format } from 'winston';

import { Env } from '../types';

const createLogger = (
  env: Env,
  label: string,
  customFormat: Format,
  defaultMeta?: unknown
) => {
  const defaultFormat = format.combine(
    format.label({
      label,
    }),
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    format.splat(),
    format.errors({ stack: true }),
    customFormat
  );
  const transports: winston.transport[] = [];

  transports.push(
    new winston.transports.Console({
      handleExceptions: true,
      format:
        env === 'production'
          ? defaultFormat
          : format.combine(format.colorize(), defaultFormat),
    })
  );

  return winston.createLogger({
    level: 'debug',
    format: defaultFormat,
    defaultMeta,
    transports,
  });
};

export const createShardLogger = (env: Env, shardId: number) => {
  const customFormat = format.printf(
    ({ timestamp, label, shard, level, message, stack }) => {
      let str = `[${timestamp} @ ${label}#${shard}] ${level}: ${message}`;
      if (stack) {
        str += `\n${stack}`;
      }
      return str;
    }
  );
  return createLogger(env, 'arch-bot', customFormat, { shard: shardId });
};

export const createShardManagerLogger = (env: Env) => {
  const customFormat = format.printf(
    ({ timestamp, label, level, message }) =>
      `[${timestamp} @ ${label}] ${level}: ${message}`
  );
  return createLogger(env, 'shard-manager', customFormat);
};
