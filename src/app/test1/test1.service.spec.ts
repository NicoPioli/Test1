// src/app/test1/test1.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Test1Service } from './test1.service';

describe('Test1Service', () => {
  let service: Test1Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Test1Service,
        provideHttpClient(), // Provider for HttpClient
        provideHttpClientTesting(), // Testing utilities for HttpClient
      ],
    });
    service = TestBed.inject(Test1Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no pending HTTP requests.
    httpMock.verify();
  });

  it('should fetch URLs while respecting the concurrency limit', async () => {
    const urls = ['/api/data1', '/api/data2', '/api/data3', '/api/data4'];
    const maxConcurrency = 2;
    const expectedResponses = [
      { data: 'response1' },
      { data: 'response2' },
      { data: 'response3' },
      { data: 'response4' },
    ];

    // Call the method to test.
    const promise = service.fetchUrls(urls, maxConcurrency);

    // Due to the concurrency limit of 2, initially only the first two requests are sent.
    const req1 = httpMock.expectOne('/api/data1');
    const req2 = httpMock.expectOne('/api/data2');
    req1.flush(expectedResponses[0]);
    req2.flush(expectedResponses[1]);

    // After the first two are completed, the remaining requests should be sent.
    const req3 = httpMock.expectOne('/api/data3');
    const req4 = httpMock.expectOne('/api/data4');
    req3.flush(expectedResponses[2]);
    req4.flush(expectedResponses[3]);

    // Verify that the Promise resolves with the expected responses.
    const result = await promise;
    expect(result).toEqual(expectedResponses);
  });
});
