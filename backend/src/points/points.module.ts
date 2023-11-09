import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { HtmlService } from '../shared/infrastructure/html/html.service';

@Module({
  providers: [HtmlService, PointsService],
  controllers: [PointsController],
})
export class PointsModule {}
