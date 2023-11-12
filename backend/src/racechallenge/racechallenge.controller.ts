import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { RaceChallengeService } from './racechallenge.service';

@Controller('racechallenge')
export class RaceChallengeController {
  private leaderboardList: { [key: string]: string } = {};

  constructor(private readonly challengeService: RaceChallengeService) {
    this.leaderboardList = this.challengeService.findAll();
  }

  @Get()
  getLeaderboardList(@Res() res: Response) {
    res.status(200).json(Object.keys(this.leaderboardList));
  }

  @Get(':leaderboard')
  getAllCurrentLeaboard(
    @Res() res: Response,
    @Param('leaderboard') leaderboard: string,
  ) {
    if (!this.challengeService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    leaderboard = this.leaderboardList[leaderboard];

    this.challengeService.getAllCurrentLeaderboard(leaderboard).subscribe({
      next(value) {
        return res.status(200).json(value);
      },
      error(error) {
        res.status(500).json({ error });
      },
    });
  }

  @Get(':leaderboard/:page')
  getCurrentLeaderboard(
    @Res() res: Response,
    @Param() params: { leaderboard: string; page: number },
  ) {
    let { leaderboard } = params;

    if (!this.challengeService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    leaderboard = this.leaderboardList[leaderboard];

    this.challengeService
      .getCurrentLeaderboard(leaderboard, params.page)
      .subscribe({
        next(value) {
          return res.status(200).json(value);
        },
        error(error) {
          res.status(500).json({ error });
        },
      });
  }
}
