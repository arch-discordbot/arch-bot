import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ArchGuild } from './ArchGuildModel';
import { Snowflake } from 'discord.js';

@modelOptions({
  schemaOptions: {
    collection: 'punishments',
    timestamps: {
      createdAt: true,
    },
  },
})
export class Punishment extends Base {
  @prop({ required: true, ref: () => ArchGuild })
  public guild!: Ref<ArchGuild>;
  @prop({ required: true, type: () => String })
  public punisher!: Snowflake;
  @prop({ required: true, type: () => String })
  public user!: Snowflake;
  @prop()
  public reason?: string;
  @prop()
  public createdAt?: Date;
  @prop({ type: () => Number })
  public expiresIn = -1;
}

export const PunishmentModel = getModelForClass(Punishment);
