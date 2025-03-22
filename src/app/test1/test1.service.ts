import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Test1Service {
  constructor(private readonly http: HttpClient) {
    // The HttpClient is injected via Angular's dependency injection system.
  }

  /**
   * Fetches an array of URLs while limiting the number of concurrent requests.
   *
   * This method converts the given array of URLs into an Observable stream using `from()`.
   * It then maps each URL to an HTTP GET request using `mergeMap()`, which is configured with
   * a concurrency limit (`maxConcurrency`). This means that no more than `maxConcurrency` requests
   * are active at any given time. All responses are then aggregated into a single array using the
   * `toArray()` operator. Finally, `firstValueFrom()` converts the Observable into a Promise that
   * resolves once the stream completes (i.e., when all HTTP requests have finished).
   *
   * @param urls Array of URLs to fetch.
   * @param maxConcurrency Maximum number of simultaneous HTTP requests allowed.
   * @returns A Promise that resolves with an array of responses.
   */
  fetchUrls(urls: string[], maxConcurrency: number): Promise<any[]> {
    return firstValueFrom(
      from(urls).pipe(
        // For each URL emitted by the observable, make an HTTP GET request.
        // The `mergeMap` operator manages the concurrency, ensuring that only `maxConcurrency`
        // number of requests are active simultaneously.
        mergeMap((url) => this.http.get(url), maxConcurrency),
        // Collect all emitted HTTP responses into a single array.
        toArray()
      )
    );
  }
}
