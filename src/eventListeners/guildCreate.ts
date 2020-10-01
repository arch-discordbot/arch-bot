import { createEventListener } from '../core/eventListener/EventListener';
import { GuildModel } from '../models/GuildModel';

export default createEventListener('guildCreate', async (_client, guild) => {
  console.log('joined guild', guild.id);

  const documentQuery = await GuildModel.create({
    _id: guild.id,
    name: guild.name,
    prefix: '!',
  });
  console.log(documentQuery);
});
