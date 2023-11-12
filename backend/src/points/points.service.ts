import { Injectable } from '@nestjs/common';
import { PointEntries } from './points.interface';
import { CollectorService } from '../shared/infrastructure/collector/collector.service';
import {
  EMPTY,
  Observable,
  asyncScheduler,
  concatMap,
  map,
  scheduled,
} from 'rxjs';

@Injectable()
export class PointsService {
  private readonly pointsUrl = `${process.env.TU_URL}/timing/points?page={page}&month={month}`;

  constructor(private readonly collector: CollectorService) {}

  getPage(page: number, currentMonth: number) {
    const url = this.pointsUrl
      .replace(/{page}/g, page.toString())
      .replace(/{month}/g, currentMonth.toString());
    const html = this.collector.fetchHtmlContent(url);

    return html.pipe(
      map((html: string) => this.collector.extractPointsTable(html)),
    );
  }

  getPointPerPage(page: number, currentMonth: number) {
    return this.getPage(page, currentMonth);
  }

  getAllPoints(currentMonth: number) {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<PointEntries>((observer) => {
      const pointEntries: PointEntries = [];
      const processNextPage = () => {
        const htmlObservable = this.getPage(currentPage, currentMonth);

        htmlObservable
          .pipe(
            concatMap((data: PointEntries) => {
              if (data.length > 0) {
                pointEntries.push(...data);
                currentPage++;
                return scheduled(data, asyncScheduler);
              } else {
                isNotEmpty = false;
                return EMPTY;
              }
            }),
          )
          .subscribe({
            complete: () => {
              if (isNotEmpty) {
                processNextPage();
              } else {
                observer.next(pointEntries);
                observer.complete();
              }
            },
            error: (err) => observer.error(err),
          });
      };

      processNextPage();
    });
  }
}
