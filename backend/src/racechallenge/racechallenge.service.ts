import { Injectable } from '@nestjs/common';
import { CollectorService } from '../shared/infrastructure/collector/collector.service';
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
    ennaSkyline: 'Enna Skyline',
    hakoneNanamagari: 'Hakone Nanamagari',
    hakoneTurnpike: 'Hakone Turnpike',
    happogahara: 'Happogahara',
    irohazaka: 'Irohazaka',
    mazePass: 'Maze Pass',
    momijiLine: 'Momiji Line',
    mtAkagi: 'Mt Akagi',
    mtAkina: 'Mt Akina',
    mtMyogi: 'Mt Myogi',
    mtTsukubaFruitsLine: 'Mt Tsukuba Fruits Line',
    mtTsukubaSnow: 'Mt Tsukuba Snow',
    nagao: 'Nagao',
    sadaminePass: 'Sadamine Pass',
    shomaruPass: 'Shomaru Pass',
    tsubakiLine: 'Tsubaki Line',
    tsuchisaka: 'Tsuchisaka',
    usuiPass: 'Usui Pass',
  };

  public findAll() {
    return this.leaderboardList;
  }

  public leaderboardIncludes(leaderboard: string): boolean {
    const leaderboardKeys = Object.keys(this.leaderboardList);
    return leaderboardKeys.includes(leaderboard);
  }

  public isLeaderboardExist(leaderboard: string, res: Response) {
    if (!this.leaderboardIncludes(leaderboard)) {
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
