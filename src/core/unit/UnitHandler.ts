import path from 'path';
import { EventEmitter } from 'events';

import { Client, Collection } from 'discord.js';

import { Unit } from './Unit';
import listFilesRecursive from '../../utils/listFilesRecursive';

export type UnitHandlerOptions = {
  readonly directory: string;
  readonly extensions: string[];
};

export class UnitHandler<U extends Unit = Unit> extends EventEmitter {
  protected client: Client;
  directory: string;
  extensions: string[];

  units: Collection<string, U> = new Collection();

  constructor(client: Client, options: UnitHandlerOptions) {
    super();
    this.client = client;
    this.directory = options.directory;
    this.extensions = options.extensions;
  }

  async load(unitPath: string): Promise<U> {
    const extension = path.extname(unitPath);

    if (!this.extensions.includes(extension)) {
      throw new Error(
        `Invalid unit extension passed to load method. Expected any of ${this.extensions}. Got: ${extension}`
      );
    }

    const unitModule = await import(path.resolve(unitPath));
    const unit = unitModule.default as U;
    unit.handler = this;
    unit.filePath = unitPath;

    if (this.units.has(unit.id)) {
      throw new Error(`The unit with id ${unit.id} is already loaded.`);
    }

    this.units.set(unit.id, unit);
    this.emit('unitLoaded', unit);

    return unit;
  }

  unload(id: string): U {
    const unit = this.units.get(id);
    if (!unit) {
      throw new Error(`Unit with id "${id}" not found`);
    }

    this.units.delete(id);
    this.emit('unitUnloaded', unit);
    return unit;
  }

  async reload(id: string) {
    const unit = this.units.get(id);
    if (!unit) {
      throw new Error(`Unit with id "${id}" not found`);
    }
    if (!unit.filePath) {
      throw new Error(`Unit with id "${id}" can not be reloaded.`);
    }

    this.unload(id);
    const reloadedUnit = await this.load(unit.filePath);
    this.emit('unitReloaded', reloadedUnit);
  }

  async loadAll() {
    const files = listFilesRecursive(this.directory).filter((file) =>
      this.extensions.includes(path.extname(file))
    );

    await Promise.all(files.map((file) => this.load(path.resolve(file))));
    this.emit('allLoaded');
  }

  unloadAll() {
    this.units.forEach((unit) => this.unload(unit.id));
    this.emit('allUnloaded');
  }

  async reloadAll() {
    await Promise.all(this.units.map((unit) => this.reload(unit.id)));
    this.emit('allReloaded');
  }
}
