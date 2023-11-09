import { Module } from '@nestjs/common';
import { HtmlService } from './html.service';

@Module({
  providers: [HtmlService],
  exports: [HtmlService],
})
export class HtmlModule {}
