import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from '@typegoose/typegoose';
import { MatchKeysAndValues } from 'mongodb';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Snowflake } from 'discord.js';
import ArchGuild from '../../structures/ArchGuild';

const DEFAULT_CONFIG: MatchKeysAndValues<GuildConfig> = {
  prefix: 'a!',
};

@modelOptions({
  schemaOptions: {
    collection: 'guild_config',
  },
})
export class GuildConfig extends Base<Snowflake> {
  @prop({
    match: /^\d+$/,
  })
  public _id!: Snowflake;
  @prop({ default: 'a!', type: () => String })
  public prefix = 'a!';
  @prop({ default: 'en-US', type: () => String })
  public locale = 'en-US';
  @prop({ type: () => String })
  public mutedRole?: Snowflake;

  public static findOrCreate(
    this: ReturnModelType<typeof GuildConfig>,
    guild: ArchGuild
  ) {
    return this.findOneAndUpdate(
      { _id: guild.id },
      {
        $set: {
          _id: guild.id,
        },
        $setOnInsert: DEFAULT_CONFIG,
      },
      { upsert: true, new: true }
    );
  }
}

export const GuildConfigModel = getModelForClass(GuildConfig);
