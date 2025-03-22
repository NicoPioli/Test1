import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Test1Service {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches an array of URLs while limiting the number of concurrent requests.
   * @param urls Array of URLs to fetch.
   * @param maxConcurrency Maximum number of simultaneous requests.
   * @returns A Promise that resolves with an array of responses.
   */
  fetchUrls(urls: string[], maxConcurrency: number): Promise<any[]> {
    return firstValueFrom(
      from(urls).pipe(
        mergeMap((url) => this.http.get(url), maxConcurrency),
        toArray()
      )
    );
  }
}
