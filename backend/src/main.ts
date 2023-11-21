import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
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
  });
  await app.listen(3000);
}
bootstrap();
