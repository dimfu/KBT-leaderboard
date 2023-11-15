import { Injectable } from '@nestjs/common';
import {
  LeaderboardCategories,
  PointEntries,
  PointParams,
  TimingEntries,
  TimingParams,
  TimingParamsWithoutPage,
  UrlParams,
} from './leaderboard.interface';
import { CollectorService } from '../collector/collector.service';
import {
  EMPTY,
  Observable,
  asyncScheduler,
  concatMap,
  map,
  scheduled,
} from 'rxjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeaderboardService {
  private config: Record<string, any>;
  constructor(
    private readonly collector: CollectorService,
    private configService: ConfigService,
  ) {
    this.config = this.configService.get<Record<string, any>>('leaderboard');
  }

  getAllLeaderboard() {
    return this.config.leaderboardList;
  }

  getPage(category: LeaderboardCategories, params: UrlParams) {
    const url = this.buildUrl(category, params);
    const html = this.collector.fetchHtmlContent(url);

    return html.pipe(
      map((html: string) => {
        switch (category) {
          case 'points':
            return this.collector.extractPointsTable(html);
          case 'timing':
            return this.collector.extractTimingTable(html);
        }
      }),
    );
  }

  private buildUrl(category: LeaderboardCategories, params: UrlParams) {
    const hasTimingParams = (params: UrlParams): params is TimingParams => {
      return 'stage' in params && 'track' in params;
    };

    let url: string;

    // currentMonth -> month so that when replacing placeholder it fit with the url from Touge Union
    const { currentMonth: month, leaderboard, page } = params;

    switch (category) {
      case 'timing':
        if (hasTimingParams(params)) {
          url = this.replacePlaceholder(this.config.timingUrl, {
            page,
            month: month ?? 0,
            car: params.car ?? '',
            stage: params.stage ?? '',
            track: params.track,
            leaderboard,
          });
        }
        break;
      case 'points':
        url = this.replacePlaceholder(this.config.pointsUrl, {
          page,
          month,
          leaderboard,
        });
        break;
      default:
        throw new Error('invalid category');
    }
    return url;
  }

  private replacePlaceholder(
    urlTemplate: string,
    replacements: Record<string, string | number>,
  ): string {
    let updatedUrl = urlTemplate;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      if (value === undefined) {
        throw new Error(`Replacement value for "${placeholder}" is undefined.`);
      }
      updatedUrl = updatedUrl.replace(
        new RegExp(`{${placeholder}}`, 'g'),
        value.toString(),
      );
    });
    return updatedUrl;
  }

  public capitalizeLeaderboard(leaderboard: string) {
    return leaderboard.replace(/^.{1}/g, leaderboard[0].toUpperCase());
  }

  public isLeaderboardExist(leaderboard: string, res: Response) {
    if (!this.config.leaderboardList.includes(leaderboard)) {
      res.status(404).json({
        error:
          'Leaderboard not found, see /leaderboard to see leaderboard list',
      });
      return false;
    }
    return true;
  }

  getPointPerPage(params: PointParams) {
    return this.getPage('points', params);
  }

  getTimingPerPage(params: TimingParams) {
    return this.getPage('timing', params);
  }

  getAllPoints(currentMonth: number, leaderboard: string) {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<PointEntries>((observer) => {
      const pointEntries: PointEntries = [];
      const processNextPage = () => {
        const htmlObservable = this.getPage('points', {
          currentMonth,
          leaderboard,
          page: currentPage,
        });

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

  getAllTiming(params: TimingParamsWithoutPage) {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<TimingEntries>((observer) => {
      const timingEntries: TimingEntries = [];
      const processNextPage = () => {
        const htmlObservable = this.getPage('timing', {
          currentMonth: params.currentMonth,
          leaderboard: params.leaderboard,
          track: params.track,
          stage: params.stage,
          page: currentPage,
        });

        htmlObservable
          .pipe(
            concatMap((data: TimingEntries) => {
              if (data.length > 0) {
                timingEntries.push(...data);
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
                observer.next(timingEntries);
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
