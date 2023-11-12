import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { RaceChallengeService } from './racechallenge.service';

@Controller('racechallenge')
export class RaceChallengeController {
  constructor(private readonly challengeService: RaceChallengeService) {}

  @Get()
  getLeaderboardList(@Res() res: Response) {
    res.status(200).json(this.challengeService.findAll());
  }

  @Get(':leaderboard')
  getAllCurrentLeaboard(
    @Res() res: Response,
    @Param('leaderboard') leaderboard: string,
  ) {
    if (!this.challengeService.isLeaderboardExist(leaderboard, res)) {
      return;
    }
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
    const { leaderboard, page } = params;
    if (!this.challengeService.isLeaderboardExist(leaderboard, res)) {
      return;
    }
    this.challengeService.getCurrentLeaderboard(leaderboard, page).subscribe({
      next(value) {
        return res.status(200).json(value);
      },
      error(error) {
        res.status(500).json({ error });
      },
    });
  }
}
