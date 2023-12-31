import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Observable, catchError, from, map } from 'rxjs';
import {
  PointEntries,
  TimingEntries,
} from '../leaderboard/leaderboard.interface';
import { RaceChallengeEntries } from '../racechallenge/racechallenge.interface';

@Injectable()
export class CollectorService {
  fetchHtmlContent(url: string): Observable<string> {
    return from(axios.get(url)).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Failed to fetch HTML');
        }

        return response.data;
      }),
      catchError((error) => {
        throw new Error(`Error fetching HTML: ${error.message}`);
      }),
    );
  }

  extractPointsTable(html: string): PointEntries {
    const $ = cheerio.load(html);
    const result = $('table > tbody > tr')
      .map((_, row) => {
        const tds = $(row).find('td');
        const rank = parseInt($(tds[0]).text());
        const name = $(tds[1]).text();
        const points = parseInt($(tds[2]).text());

        return { rank, name, points };
      })
      .get();

    return result;
  }

  extractRaceChallengeTable(html: string): RaceChallengeEntries {
    const $ = cheerio.load(html);
    const result = $('table > tbody > tr')
      .map((_, row) => {
        const tds = $(row).find('td');
        const rank = parseInt($(tds[0]).text());
        const name = $(tds[1]).text();
        const rating = parseInt($(tds[2]).text());

        return { rank, name, rating };
      })
      .get();

    return result;
  }

  extractTimingTable(html: string): TimingEntries {
    const $ = cheerio.load(html);
    const result = $('table > tbody > tr')
      .map((_, row) => {
        const tds = $(row).find('td');
        const rank = parseInt($(tds[0]).text());
        const date = $(tds[1]).text();
        const name = $(tds[2]).text();
        const car = $(tds[3]).text();
        const time = $(tds[4]).text();

        return { rank, date, name, car, time };
      })
      .get();

    return result;
  }
}
