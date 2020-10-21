import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Snowflake } from 'discord.js';

export enum PunishmentType {
  BAN,
  MUTE,
}

@modelOptions({
  schemaOptions: {
    collection: 'punishments',
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
})
export class Punishment extends Base {
  @prop({ required: true, type: () => String })
  public guild!: Snowflake;
  @prop({ required: true, type: () => String })
  public punisher!: Snowflake;
  @prop({ required: true, type: () => String })
  public user!: Snowflake;
  @prop({ required: true, enum: PunishmentType })
  public type!: PunishmentType;
  @prop()
  public reason?: string;
  @prop()
  public createdAt?: Date;
  @prop({ type: () => Number, default: -1 })
  public expiresIn = -1;
}

export const PunishmentModel = getModelForClass(Punishment);
