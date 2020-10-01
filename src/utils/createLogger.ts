import winston, { format } from 'winston';

export const createLogger = (env: Env, shardId: number) => {
  const defaultFormat = format.combine(
    format.label({
      label: 'arch-bot'
    }),
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
  );
  const transports: winston.transport[] = [];

  if (env === 'production') {
    // transports.push(new winston.transports.File({
    //   dirname: 'logs',
    //
    // }));
  } else {
    transports.push(new winston.transports.Console({
      handleExceptions: true,
      format: format.combine(
        defaultFormat,
        format.errors({ stack: true }),
        format.colorize(),
        format.simple()
      )
    }));
  }

  return winston.createLogger({
    level: 'info',
    format: defaultFormat,
    defaultMeta: {
      shard: shardId,
    },
    transports
  });
}
