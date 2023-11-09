import { Injectable } from '@nestjs/common';
import { PointEntries } from './interfaces/points.interface';
import { HtmlService } from 'src/shared/infrastructure/html/html.service';
import { Observable } from 'rxjs';

@Injectable()
export class PointsService {
  private pointEntries: PointEntries = [];
  private readonly pointsUrl = `${process.env.TU_URL}/timing/points?page={page}&month=0`;

  constructor(private readonly htmlService: HtmlService) {
    this.pointEntries = [];
  }

  getPointPage(page: number): Observable<string> {
    const pageRegex = /{page}/g;
    const urlWithPage = this.pointsUrl.replace(pageRegex, page.toString());
    return this.htmlService.fetchHtmlContent(urlWithPage);
  }
}
