import { Module } from '@nestjs/common';
import { RaceChallengeService } from './racechallenge.service';
import { RaceChallengeController } from './racechallenge.controller';
import { CollectorService } from '../collector/collector.service';

@Module({
  providers: [CollectorService, RaceChallengeService],
  controllers: [RaceChallengeController],
})
export class RaceChallengeModule {}
