import { Controller, Get, Query } from '@nestjs/common';
import { PointsService } from './points.service';
import { Observable } from 'rxjs';

@Controller('points')
export class PointsController {
  constructor(private pointService: PointsService) {}

  @Get('all')
  getAllPoints(@Query('page') page = 0): Observable<string> {
    return this.pointService.getPointPage(page);
  }
}
