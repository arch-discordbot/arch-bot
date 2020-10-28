import { Command } from 'discord-akairo';
import fetch from 'node-fetch';

import ArchMessage from '../../structures/ArchMessage';

type QuerySearchResponse = number[];

interface AnimeTheme {
  themeType: string;
  themeName: string;
  mirror: {
    mirrorURL: string;
    priority: number;
    notes: string;
  }
}

interface Anime {
  malID: number;
  name: string;
  year: number;
  season: string;
  themes: AnimeTheme[];
}

type QuerySearchResultResponse = Anime[];

export default class AnimeCommand extends Command {
  constructor() {
    super('anime', {
      aliases: ['anime'],
      channel: 'guild',
      args: [
        {
          id: 'searchQuery',
          type: 'string',
          match: 'rest'
        },
      ],
    });
  }

  async exec(
    message: ArchMessage,
    args: { searchQuery: string }
  ) {
    if (!message.member || message.channel.type !== 'text') {
      return;
    }

    const { channel } = message;
    const { searchQuery } = args;

    const animeIds = await this.searchIds(searchQuery);
    const animes = await this.searchAnimes(animeIds);

    const result = animes[0].themes.map(theme => `${theme.themeName} [${theme.themeType}] \`${theme.mirror.mirrorURL}\``).join('\n');

    return channel.send(result);
  }

  async searchIds(query: string): Promise<QuerySearchResponse> {
    const response = await fetch(`https://themes.moe/api/anime/search/${encodeURIComponent(query)}`, {
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "pt-BR"
      },
    });
    return response.json();
  }

  async searchAnimes(ids: number[]): Promise<QuerySearchResultResponse> {
    const response = await fetch("https://themes.moe/api/themes/search", {
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "pt-BR",
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(ids),
      "method": "POST",
    });
    return response.json();
  }

}
