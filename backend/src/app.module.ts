import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ConfigModule } from '@nestjs/config';
import { RaceChallengeModule } from './racechallenge/racechallenge.module';
import leaderboardConfig from './configs/leaderboard.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ExecutionTimeMiddleware } from './logger/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [leaderboardConfig],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm',
            }),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} ${level}: ${message} `;
            }),
          ),
        }),
      ],
    }),
    LeaderboardModule,
    RaceChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExecutionTimeMiddleware).forRoutes('*');
  }
}
