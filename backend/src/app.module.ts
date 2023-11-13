import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ConfigModule } from '@nestjs/config';
import { RaceChallengeModule } from './racechallenge/racechallenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LeaderboardModule,
    RaceChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
