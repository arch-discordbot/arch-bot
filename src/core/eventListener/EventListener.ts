import { createUnit, Unit } from '../unit/Unit';
import { Client, ClientEvents } from 'discord.js';

type EventListenerExecutor<E extends keyof ClientEvents = any> = (
  client: Client,
  ...args: ClientEvents[E]
) => void;

type EventListener = Unit & {
  event: string;
  executor: EventListenerExecutor;
};

export default EventListener;

export const createEventListener = <E extends keyof ClientEvents>(
  event: E,
  executor: EventListenerExecutor<E>,
  id: string = event
): EventListener =>
  createUnit<EventListener>(id, {
    event,
    executor,
  });
