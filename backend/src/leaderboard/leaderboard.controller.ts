import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LeaderboardService } from './leaderboard.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CustomLogger } from '../logger/logger.decorator';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private leaderboardService: LeaderboardService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  @CustomLogger()
  public getAllLeaderboard(@Res() res: Response) {
    return res.status(200).json(this.leaderboardService.getAllLeaderboard());
  }

  @Get('timing/:leaderboard')
  public getAllTracks(
    @Param('leaderboard') leaderboard: string,
    @Res() res: Response,
  ) {
    leaderboard = this.leaderboardService.capitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    if (leaderboard === 'All') {
      this.logger.error('cannot use `all` leaderboard in timing');
      return res
        .status(404)
        .json({ error: 'leaderboard `all` cant be used in timing' });
    }

    return res
      .status(200)
      .json(this.leaderboardService.getAllTracks(leaderboard));
  }

  @Get('timing/:leaderboard')
  @CustomLogger()
  public getLeaderboardTracks(
    @Param('leaderboard') leaderboard: string,
    @Res() res: Response,
  ) {
    leaderboard = this.leaderboardService.capitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    if (leaderboard === 'All') {
      return res
        .status(404)
        .json({ error: 'leaderboard `all` cant be used in timing' });
    }
  }

  @Get('points/:leaderboard')
  @CustomLogger()
  public async getAllPoints(
    @Param('leaderboard') leaderboard: string,
    @Res() res: Response,
    @Query('currentMonth') currentMonth = 0,
  ): Promise<void> {
    const logger = this.logger;

    leaderboard = this.leaderboardService.capitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    // set leaderboard to empty string to get all leaderboard points
    if (leaderboard === 'All') {
      leaderboard = '';
    }

    this.leaderboardService
      .getAllPoints({ currentMonth, leaderboard })
      .subscribe({
        next(data) {
          return res.status(200).json(data);
        },
        error(error) {
          logger.error(error);
          return res.status(500).json({ error });
        },
      });
  }

  @Get('timing/:leaderboard/:track')
  @CustomLogger()
  public async getAllTiming(
    @Param() params: { leaderboard: string; page: number; track: string },
    @Query()
    query: { currentMonth: number; stage: string; car: string },
    @Res() res: Response,
  ): Promise<void> {
    const logger = this.logger;

    params.leaderboard = this.leaderboardService.capitalizeLeaderboard(
      params.leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(params.leaderboard, res))
      return;

    if (
      !this.leaderboardService.isTrackExist(
        params.leaderboard,
        params.track,
        res,
      )
    )
      return;

    this.leaderboardService
      .getAllTiming({
        currentMonth: query.currentMonth,
        leaderboard: params.leaderboard,
        stage: query.stage,
        track: params.track,
        car: query.car,
      })
      .subscribe({
        next(data) {
          return res.status(200).json(data);
        },
        error(error) {
          logger.error(error);
          return res.status(500).json({ error });
        },
      });
  }

  @Get('points/:leaderboard/:page')
  @CustomLogger()
  public async getPointPerPage(
    @Param() params: { leaderboard: string; page: number },
    @Query('currentMonth') currentMonth = 0,
    @Res() res: Response,
  ): Promise<void> {
    const logger = this.logger;
    let { leaderboard } = params;

    leaderboard = this.leaderboardService.capitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) return;

    if (leaderboard === 'All') {
      leaderboard = '';
    }

    this.leaderboardService
      .getPointPerPage({ page: params.page, currentMonth, leaderboard })
      .subscribe({
        next(data) {
          return res.status(200).json(data);
        },
        error(error) {
          logger.error(error);
          return res.status(500).json({ error });
        },
      });
  }

  @Get('timing/:leaderboard/:track/:page')
  @CustomLogger()
  public async getTimingPerPage(
    @Param() params: { leaderboard: string; page: number; track: string },
    @Query()
    query: { currentMonth: number; stage: string; car: string },
    @Res() res: Response,
  ): Promise<void> {
    const logger = this.logger;

    if (!query.currentMonth) {
      query.currentMonth = 0;
    }

    let { leaderboard } = params;

    leaderboard = this.leaderboardService.capitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) return;

    if (leaderboard === 'All') {
      leaderboard = '';
    }

    if (!this.leaderboardService.isTrackExist(leaderboard, params.track, res))
      return;

    this.leaderboardService
      .getTimingPerPage({
        page: params.page,
        currentMonth: query.currentMonth,
        leaderboard,
        track: params.track,
        stage: query.stage,
      })
      .subscribe({
        next(data) {
          return res.status(200).json(data);
        },
        error(error) {
          logger.error(error);
          return res.status(500).json({ error });
        },
      });
  }
}
