import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { CollectorService } from '../collector/collector.service';

@Module({
  providers: [CollectorService, LeaderboardService],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
