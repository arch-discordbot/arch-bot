import { createCommand } from '../core/command/Command';

export default createCommand(
  'test',
  'test',
  undefined,
  (_client, _message, data) => {
    console.log('executor test', data);
  }
);
