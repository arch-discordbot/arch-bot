import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';
import { MatchKeysAndValues } from 'mongodb';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Guild, Snowflake } from 'discord.js';

const DEFAULT_CONFIG: MatchKeysAndValues<ArchGuild> = {
  prefix: 'a!',
};

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
  @prop({ default: 'a!', type: () => String })
  public prefix = 'a!';
  @prop({ default: 'en-US', type: () => String })
  public locale = 'en-US';

  public static async findOrCreate(
    this: ReturnModelType<typeof ArchGuild>,
    guild: Guild
  ) {
    return this.findOneAndUpdate(
      { _id: guild.id },
      {
        $set: {
          _id: guild.id,
          name: guild.name,
        },
        $setOnInsert: DEFAULT_CONFIG,
      },
      { upsert: true, new: true }
    );
  }
}

export const ArchGuildModel = getModelForClass(ArchGuild);
