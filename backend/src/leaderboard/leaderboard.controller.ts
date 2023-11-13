import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('points')
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

  @Get('points/:leaderboard/:num')
  async getPointPerPage(
    @Param() params: { leaderboard: string; num: number },
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
      .getPointPerPage(params.num, currentMonth, leaderboard)
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
}
