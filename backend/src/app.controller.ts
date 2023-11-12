import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  healthCheck(@Res() res: Response) {
    res.status(200).send('OK!');
  }
}
