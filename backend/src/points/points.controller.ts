import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private pointService: PointsService) {}

  @Get()
  getAllLeaderboard(@Res() res: Response) {
    return res.status(200).json(this.pointService.getAllLeaderboard());
  }

  @Get(':leaderboard')
  async getAllPoints(
    @Param('leaderboard') leaderboard: string,
    @Res() res: Response,
    @Query('currentMonth') currentMonth = 0,
  ): Promise<void> {
    leaderboard = this.pointService.caplitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.pointService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    // set leaderboard to empty string to get all leaderboard points
    if (leaderboard === 'All') {
      leaderboard = '';
    }

    this.pointService.getAllPoints(currentMonth, leaderboard).subscribe({
      next(data) {
        return res.status(200).json(data);
      },
      error(error) {
        return res.status(500).json({ error });
      },
    });
  }

  @Get(':leaderboard/:num')
  async getPointPerPage(
    @Param() params: { leaderboard: string; num: number },
    @Query('currentMonth') currentMonth = 0,
    @Res() res: Response,
  ): Promise<void> {
    let { leaderboard } = params;

    leaderboard = this.pointService.caplitalizeLeaderboard(
      leaderboard.toLowerCase(),
    );

    if (!this.pointService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    if (leaderboard === 'All') {
      leaderboard = '';
    }

    this.pointService
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
