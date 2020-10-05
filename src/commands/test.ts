import { Command } from 'discord-akairo';

export default class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test'],
      channel: 'guild',
    });
  }

  async exec() {

  }
}
