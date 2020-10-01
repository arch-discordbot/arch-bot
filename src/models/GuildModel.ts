import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class ArchGuild extends Base<string> {
  @prop()
  public _id!: string;
  @prop({ required: true })
  public name?: string;
  @prop({ default: '!' })
  public prefix: string = '!';
}

export const GuildModel = getModelForClass(ArchGuild, {
  schemaOptions: {
    collection: 'guilds',
  },
});
