import { Injectable } from '@nestjs/common';
import { CollectorService } from '../collector/collector.service';
import {
  EMPTY,
  Observable,
  asyncScheduler,
  concatMap,
  map,
  scheduled,
} from 'rxjs';
import { RaceChallengeEntries } from './racechallenge.interface';
import { Response } from 'express';

@Injectable()
export class RaceChallengeService {
  constructor(private readonly collector: CollectorService) {}

  private readonly challengeUrl = `${process.env.TU_URL}/racechallenge?leaderboard={leaderboard}&page={page}`;
  private leaderboardList = {
    ennaskyline: 'Enna Skyline',
    hakonenanamagari: 'Hakone Nanamagari',
    hakoneturnpike: 'Hakone Turnpike',
    happogahara: 'Happogahara',
    irohazaka: 'Irohazaka',
    mazepass: 'Maze Pass',
    momijiline: 'Momiji Line',
    mtakagi: 'Mt Akagi',
    mtakina: 'Mt Akina',
    mtmyogi: 'Mt Myogi',
    mttsukubafruitsline: 'Mt Tsukuba Fruits Line',
    mttsukubasnow: 'Mt Tsukuba Snow',
    nagao: 'Nagao',
    sadaminepass: 'Sadamine Pass',
    shomarupass: 'Shomaru Pass',
    tsubakiline: 'Tsubaki Line',
    tsuchisaka: 'Tsuchisaka',
    usuipass: 'Usui Pass',
  };

  public getAllLeaderboard() {
    return this.leaderboardList;
  }

  public isLeaderboardExist(leaderboard: string, res: Response) {
    const leaderboardKeys = Object.keys(this.leaderboardList);
    if (!leaderboardKeys.includes(leaderboard)) {
      res.status(404).json({
        error:
          'Leaderboard not found, see /racechallenge to see leaderboard list',
      });
      return false;
    }
    return true;
  }

  public getCurrentLeaderboard(leaderboard: string, page: number) {
    const url = this.challengeUrl
      .replace(/{leaderboard}/g, leaderboard)
      .replace(/{page}/g, page.toString());
    const html = this.collector.fetchHtmlContent(url);

    return html.pipe(
      map((html: string) => this.collector.extractRaceChallengeTable(html)),
    );
  }

  public getAllCurrentLeaderboard(leaderboard: string) {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<RaceChallengeEntries>((observer) => {
      const raceEntries: RaceChallengeEntries = [];
      const processNextPage = () => {
        const htmlObservable = this.getCurrentLeaderboard(
          leaderboard,
          currentPage,
        );

        htmlObservable
          .pipe(
            concatMap((data: RaceChallengeEntries) => {
              if (data.length > 0) {
                raceEntries.push(...data);
                currentPage++;
                return scheduled(data, asyncScheduler);
              } else {
                isNotEmpty = false;
                return EMPTY;
              }
            }),
          )
          .subscribe({
            complete: () => {
              if (isNotEmpty) {
                processNextPage();
              } else {
                observer.next(raceEntries);
                observer.complete();
              }
            },
            error: (err) => observer.error(err),
          });
      };
      processNextPage();
    });
  }
}
