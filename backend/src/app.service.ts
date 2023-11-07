import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Observable, catchError, from, map } from 'rxjs';

@Injectable()
export class AppService {
  fetchHtmlContent(url: string): Observable<string> {
    return from(axios.get(url)).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Failed to fetch HTML');
        }

        return response.data;
      }),
      catchError((error) => {
        throw new Error(`Error fetching HTML: ${error.message}`);
      }),
    );
  }
}
