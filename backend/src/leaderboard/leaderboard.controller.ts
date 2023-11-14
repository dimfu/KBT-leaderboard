import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  getAllLeaderboard(@Res() res: Response) {
    return res.status(200).json(this.leaderboardService.getAllLeaderboard());
  }

  @Get('points/:leaderboard')
  async getAllPoints(
    @Param('leaderboard') leaderboard: string,
    @Res() res: Response,
    @Query('currentMonth') currentMonth = 0,
  ): Promise<void> {
    leaderboard = this.leaderboardService.caplitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    // set leaderboard to empty string to get all leaderboard points
    if (leaderboard === 'All') {
      leaderboard = '';
    }

    this.leaderboardService.getAllPoints(currentMonth, leaderboard).subscribe({
      next(data) {
        return res.status(200).json(data);
      },
      error(error) {
        return res.status(500).json({ error });
      },
    });
  }

  @Get('timing/:leaderboard/:track')
  async getAllTiming(
    @Param() params: { leaderboard: string; page: number; track: string },
    @Query()
    query: { currentMonth: number; stage: string; car: string },
    @Res() res: Response,
  ): Promise<void> {
    params.leaderboard = this.leaderboardService.caplitalizeLeaderboard(
      params.leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(params.leaderboard, res)) {
      return;
    }

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
          return res.status(500).json({ error });
        },
      });
  }

  @Get('points/:leaderboard/:page')
  async getPointPerPage(
    @Param() params: { leaderboard: string; page: number },
    @Query('currentMonth') currentMonth = 0,
    @Res() res: Response,
  ): Promise<void> {
    let { leaderboard } = params;

    leaderboard = this.leaderboardService.caplitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

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
          console.error(error);
          return res.status(500).json({ error });
        },
      });
  }

  @Get('timing/:leaderboard/:track/:page')
  async getTimingPerPage(
    @Param() params: { leaderboard: string; page: number; track: string },
    @Query()
    query: { currentMonth: number; stage: string; car: string },
    @Res() res: Response,
  ): Promise<void> {
    if (!query.currentMonth) {
      query.currentMonth = 0;
    }

    let { leaderboard } = params;

    leaderboard = this.leaderboardService.caplitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.leaderboardService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    if (leaderboard === 'All') {
      leaderboard = '';
    }

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
          return res.status(500).json({ error });
        },
      });
  }
}
