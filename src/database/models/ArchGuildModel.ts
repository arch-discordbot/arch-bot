import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Snowflake } from 'discord.js';

@modelOptions({
  schemaOptions: {
    collection: 'guilds',
  },
})
export class ArchGuild extends Base<Snowflake> {
  @prop({
    match: /^\d+$/,
  })
  public _id!: Snowflake;
  @prop({ required: true })
  public name!: string;
  @prop({ default: '!', type: () => String })
  public prefix = '!';
}

export const ArchGuildModel = getModelForClass(ArchGuild);
