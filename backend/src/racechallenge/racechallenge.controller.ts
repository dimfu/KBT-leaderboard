import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { RaceChallengeService } from './racechallenge.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CustomLogger } from '../logger/logger.decorator';

@Controller('racechallenge')
export class RaceChallengeController {
  private leaderboardList: { [key: string]: string } = {};

  constructor(
    private readonly challengeService: RaceChallengeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.leaderboardList = this.challengeService.getAllLeaderboard();
  }

  @Get()
  getLeaderboardList(@Res() res: Response) {
    return res.status(200).json(Object.keys(this.leaderboardList));
  }

  @Get(':leaderboard')
  @CustomLogger()
  getAllCurrentLeaboard(
    @Res() res: Response,
    @Param('leaderboard') leaderboard: string,
  ) {
    const logger = this.logger;
    leaderboard = leaderboard.toLowerCase();

    if (!this.challengeService.isLeaderboardExist(leaderboard, res)) {
      return;
    }

    leaderboard = this.leaderboardList[leaderboard];

    this.challengeService.getAllCurrentLeaderboard(leaderboard).subscribe({
      next(value) {
        return res.status(200).json(value);
      },
      error(error) {
        logger.error(error);
        return res.status(500).json({ error });
      },
    });
  }

  @Get(':leaderboard/:page')
  @CustomLogger()
  getCurrentLeaderboard(
    @Res() res: Response,
    @Param() params: { leaderboard: string; page: number },
  ) {
    const logger = this.logger;

    let { leaderboard } = params;

    leaderboard = leaderboard.toLowerCase();

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
          logger.error(error);
          return res.status(500).json({ error });
        },
      });
  }
}
