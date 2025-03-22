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

  // Setup the testing module before each test.
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Provide the service along with the HttpClient and HttpTesting utilities.
      providers: [
        Test1Service,
        provideHttpClient(), // Sets up the HttpClient needed for HTTP requests.
        provideHttpClientTesting(), // Provides the testing utilities to intercept HTTP requests.
      ],
    });
    // Inject the service and the HttpTestingController.
    service = TestBed.inject(Test1Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Ensure that no HTTP requests remain pending after each test.
  afterEach(() => {
    httpMock.verify();
  });

  // Test to verify that fetchUrls respects the concurrency limit.
  it('should fetch URLs while respecting the concurrency limit', async () => {
    // Define a list of URLs to simulate HTTP GET requests.
    const urls = ['/api/data1', '/api/data2', '/api/data3', '/api/data4'];
    // Set the maximum concurrency limit. In this case, only 2 requests should be processed concurrently.
    const maxConcurrency = 2;
    // Define the expected responses for each URL.
    const expectedResponses = [
      { data: 'response1' },
      { data: 'response2' },
      { data: 'response3' },
      { data: 'response4' },
    ];

    // Call the fetchUrls method, which returns a Promise.
    const promise = service.fetchUrls(urls, maxConcurrency);

    // With a concurrency limit of 2, the first two HTTP GET requests should be initiated immediately.
    const req1 = httpMock.expectOne('/api/data1');
    const req2 = httpMock.expectOne('/api/data2');

    // Simulate server responses for the first two requests.
    req1.flush(expectedResponses[0]);
    req2.flush(expectedResponses[1]);

    // After the first two requests complete, the remaining two requests should be initiated.
    const req3 = httpMock.expectOne('/api/data3');
    const req4 = httpMock.expectOne('/api/data4');

    // Simulate server responses for the remaining requests.
    req3.flush(expectedResponses[2]);
    req4.flush(expectedResponses[3]);

    // Wait for the promise to resolve and verify that the aggregated responses match the expected results.
    const result = await promise;
    expect(result).toEqual(expectedResponses);
  });
});
