import { Injectable } from '@nestjs/common';
import { PointEntries } from './points.interface';
import { CollectorService } from '../shared/infrastructure/collector/collector.service';
import {
  EMPTY,
  Observable,
  asyncScheduler,
  concatMap,
  map,
  scheduled,
} from 'rxjs';
import { Response } from 'express';

@Injectable()
export class PointsService {
  private readonly pointsUrl = `${process.env.TU_URL}/timing/points?page={page}&month={month}&leaderboard={leaderboard}`;
  private leaderboardList = [
    'All',
    'Gunma',
    'Ibaraki',
    'Kanagawa',
    'Saitama',
    'Shizuoka',
    'Tochigi',
  ];

  constructor(private readonly collector: CollectorService) {}

  getAllLeaderboard() {
    return this.leaderboardList;
  }

  getPage(page: number, currentMonth: number, leaderboard: string) {
    const url = this.pointsUrl
      .replace(/{page}/g, page.toString())
      .replace(/{month}/g, currentMonth.toString())
      .replace(/{leaderboard}/g, leaderboard.toString());
    const html = this.collector.fetchHtmlContent(url);

    return html.pipe(
      map((html: string) => this.collector.extractPointsTable(html)),
    );
  }

  public caplitalizeLeaderboard(leaderboard: string) {
    return leaderboard.replace(/^.{1}/g, leaderboard[0].toUpperCase());
  }

  public isLeaderboardExist(leaderboard: string, res: Response) {
    if (!this.leaderboardList.includes(leaderboard)) {
      res.status(404).json({
        error: 'Leaderboard not found, see /points to see leaderboard list',
      });
      return false;
    }
    return true;
  }

  getPointPerPage(page: number, currentMonth: number, leaderboard: string) {
    return this.getPage(page, currentMonth, leaderboard);
  }

  getAllPoints(currentMonth: number, leaderboard: string) {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<PointEntries>((observer) => {
      const pointEntries: PointEntries = [];
      const processNextPage = () => {
        const htmlObservable = this.getPage(
          currentPage,
          currentMonth,
          leaderboard,
        );

        htmlObservable
          .pipe(
            concatMap((data: PointEntries) => {
              if (data.length > 0) {
                pointEntries.push(...data);
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
                observer.next(pointEntries);
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
