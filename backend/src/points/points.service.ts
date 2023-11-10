import { Injectable } from '@nestjs/common';
import { PointEntries } from './interfaces/points.interface';
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
  private pointEntries: PointEntries = [];
  private readonly pointsUrl = `${process.env.TU_URL}/timing/points?page={page}&month=0`;

  constructor(private readonly collector: CollectorService) {
    this.pointEntries = [];
  }

  getPage(page: number) {
    const pageRegex = /{page}/g;
    const urlWithPage = this.pointsUrl.replace(pageRegex, page.toString());
    const html = this.collector.fetchHtmlContent(urlWithPage);

    return html.pipe(
      map((html: string) => this.collector.extractPointsTable(html)),
    );
  }

  getPointPerPage(page: number) {
    return this.getPage(page);
  }

  getAllPoints() {
    let currentPage = 0;
    let isNotEmpty = true;

    return new Observable<PointEntries>((observer) => {
      const processNextPage = () => {
        const htmlObservable = this.getPage(currentPage);

        htmlObservable
          .pipe(
            concatMap((data: PointEntries) => {
              if (data.length > 0) {
                this.pointEntries.push(...data);
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
                observer.next(this.pointEntries);
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
