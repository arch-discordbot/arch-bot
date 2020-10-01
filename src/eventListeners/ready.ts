import { createEventListener } from '../core/eventListener/EventListener';

export default createEventListener('ready', (client) => {
  client.logger.info(`Logged in as ${client.user?.tag}`);
});
