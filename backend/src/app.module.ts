import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ConfigModule } from '@nestjs/config';
import { RaceChallengeModule } from './racechallenge/racechallenge.module';
import leaderboardConfig from './configs/leaderboard.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [leaderboardConfig],
    }),
    LeaderboardModule,
    RaceChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
