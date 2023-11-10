import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { CollectorService } from '../shared/infrastructure/collector/collector.service';

@Module({
  providers: [CollectorService, PointsService],
  controllers: [PointsController],
})
export class PointsModule {}
