import { createCommand } from '../core/command/Command';

export default createCommand(
  'test',
  'test',
  undefined,
  (client, _message, data) => {
    client.logger.debug('executor test', data);
  }
);
