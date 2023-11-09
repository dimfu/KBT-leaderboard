import { Controller, Get } from '@nestjs/common';

@Controller('leaderboards')
export class LeaderboardsController {
  private readonly leaderboardList: string[];

  constructor() {
    this.leaderboardList = [
      'Gunma',
      'Ibaraki',
      'Kanagawa',
      'Saitama',
      'Shizuoka',
      'Tochigi',
    ];
  }

  @Get()
  getLeaderBoardList() {
    return this.leaderboardList;
  }
}
