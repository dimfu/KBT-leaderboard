import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardsController } from './leaderboards/leaderboards.controller';
import { PointsModule } from './points/points.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PointsModule,
  ],
  controllers: [AppController, LeaderboardsController],
  providers: [AppService],
})
export class AppModule {}
