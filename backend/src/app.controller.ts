import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHTML(): Observable<string> {
    const url = 'http://5.161.130.32:8000/timing?leaderboard=Gunma';
    return this.appService.fetchHtmlContent(url);
  }
}
