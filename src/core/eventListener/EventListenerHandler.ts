import { UnitHandler, UnitHandlerOptions } from '../unit/UnitHandler';
import EventListener from './EventListener';
import { Client } from 'discord.js';

export type EventListenerHandlerOptions = UnitHandlerOptions;

export class EventListenerHandler extends UnitHandler<EventListener> {
  constructor(client: Client, options: EventListenerHandlerOptions) {
    super(client, options);
  }

  async load(unitPath: string): Promise<EventListener> {
    const eventListener = await super.load(unitPath);

    this.client.on(
      eventListener.event,
      eventListener.executor.bind(undefined, this.client)
    );

    return eventListener;
  }

  unload(id: string): EventListener {
    const eventListener = super.unload(id);
    this.client.removeListener(eventListener.event, eventListener.executor);
    return eventListener;
  }
}
