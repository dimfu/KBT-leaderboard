/* eslint-disable prefer-const */
import { Inject, Injectable } from '@nestjs/common';
import {
  LeaderboardCategories,
  LeaderboardConfig,
  PointEntries,
  PointParams,
  ProcessNextPage,
  TimingEntries,
  TimingParams,
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
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LeaderboardService {
  private config: LeaderboardConfig;
  constructor(
    private readonly collector: CollectorService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.config = this.configService.get<LeaderboardConfig>('leaderboard');
  }

  public getAllLeaderboard() {
    return this.config.leaderboardList;
  }

  public getAllTracks(leaderboard: string) {
    const filteredRegions = this.config.timingTracks.filter(
      ({ region }) => region === leaderboard,
    );

    const tracks = filteredRegions.flatMap((region) =>
      region.tracks.map(({ track }) => track),
    );

    return tracks;
  }

  public getPage(category: LeaderboardCategories, params: UrlParams) {
    const url = this.buildUrl(category, params);
    const html = this.collector.fetchHtmlContent(url);

    this.logger.info(
      `[${category}] Extracting data from page ${Number(params.page) + 1}`,
    );

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

  public isTrackExist(leaderboard: string, track: string, res: Response) {
    const tracks = this.getAllTracks(leaderboard);

    if (!tracks.includes(track)) {
      res.status(404).json({
        error:
          'Track not found, see /leaderboard/timing/{leaderboard} to see track list',
      });
      return false;
    }

    return true;
  }

  public getPointPerPage(params: PointParams) {
    return this.getPage('points', params);
  }

  public getTimingPerPage(params: TimingParams) {
    return this.getPage('timing', params);
  }

  private processNextPage<T extends any[]>(config: ProcessNextPage<T>) {
    const { category, entries, observer, params } = config;

    const htmlObservable = this.getPage(category, {
      ...params,
      page: config.currentPage,
    }) as Observable<T>;

    htmlObservable
      .pipe(
        concatMap((data) => {
          if (data.length > 0) {
            entries.push(...data);
            config.currentPage++;
            return scheduled(data, asyncScheduler);
          } else {
            config.isNotEmpty = false;
            return EMPTY;
          }
        }),
      )
      .subscribe({
        complete: () => {
          if (config.isNotEmpty) {
            this.processNextPage(config);
          } else {
            observer.next(entries);
            observer.complete();
            this.logger.info(`[${category}] Found ${entries.length} entries`);
          }
        },
        error: (err) => observer.error(err),
      });
  }

  public getAllPoints(params: PointParams) {
    let entries = [];
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<PointEntries>((observer) => {
      this.processNextPage<PointEntries>({
        currentMonth: params.currentMonth,
        params,
        category: 'points',
        entries,
        isNotEmpty,
        observer,
        currentPage,
      });
    });
  }

  public getAllTiming(params: Omit<TimingParams, 'page'>) {
    let entries = [];
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<TimingEntries>((observer) => {
      this.processNextPage<TimingEntries>({
        currentMonth: params.currentMonth,
        params,
        category: 'timing',
        entries,
        isNotEmpty,
        observer,
        currentPage,
      });
    });
  }
}
