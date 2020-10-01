import { Client } from 'discord.js';

import { UnitHandler } from './UnitHandler';

export type Unit = {
  client?: Client;
  readonly id: string;
  handler?: UnitHandler;
  filePath?: string;
  reload: () => void;
  unload: () => void;
};

export const createUnit = <UT extends Unit>(
  id: string,
  properties: Partial<UT> = {}
): UT => {
  const unit = {
    ...properties,
    id,
    reload: () => unit.handler?.reload(id),
    unload: () => unit.handler?.unload(id),
  } as UT;
  return unit;
};
