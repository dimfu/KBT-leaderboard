import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private pointService: PointsService) {}

  @Get()
  async getAllPoints(
    @Res() res: Response,
    @Query('currentMonth') currentMonth = 0,
  ): Promise<void> {
    this.pointService.getAllPoints(currentMonth).subscribe({
      next(data) {
        res.status(200).json(data);
      },
      error(error) {
        res.status(500).json({ error });
      },
    });
  }

  @Get('page/:num')
  async getPointPerPage(
    @Param() params: any,
    @Query('currentMonth') currentMonth = 0,
    @Res() res: Response,
  ): Promise<void> {
    this.pointService.getPointPerPage(params.num, currentMonth).subscribe({
      next(data) {
        res.status(200).json(data);
      },
      error(error) {
        console.error(error);
        res.status(500).json({ error });
      },
    });
  }
}