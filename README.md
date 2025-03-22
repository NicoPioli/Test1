# Question 1

Given an array of URLs and a MAX_CONCURRENCY integer, implement a function that will asynchronously
fetch each URL, not requesting more than MAX_CONCURRENCY URLs at the same time. The URLs should be
fetched as soon as possible. The function should return an array of responses for each URL.
How would you write a test forsuch a function?

## Overview

This project demonstrates an implementation of a concurrency control exercise using Angular. The objective is to fetch an array of URLs while limiting the number of concurrent HTTP requests to a maximum specified value (`MAX_CONCURRENCY`). The solution leverages RxJS operators—specifically, `mergeMap` with a concurrency limit and `toArray` to aggregate responses—along with `firstValueFrom` to convert the Observable into a Promise.

## Implementation Details

**Service Implementation:**  
The `Test1Service` is responsible for fetching URLs concurrently. It converts the array of URLs into an Observable using `from()`, then uses `mergeMap` to map each URL into an HTTP GET request. The `maxConcurrency` parameter ensures that no more than the specified number of requests run at the same time. Finally, the `toArray` operator collects all responses into an array and `firstValueFrom` converts the result into a Promise.

## Why This Approach?

This approach is both efficient and well integrated with Angular's reactive programming model. It ensures controlled concurrency, which can help manage resource usage and improve application performance, especially when dealing with multiple HTTP requests.

## Testing Instructions

**Test Setup:**  
The tests are set up using Angular 16’s testing APIs. Instead of the deprecated `HttpClientTestingModule`, the providers `provideHttpClient` and `provideHttpClientTesting` are used to configure HttpClient and its testing utilities.

**How the Test Works:**  
The test verifies that:

- Only the first two requests are sent initially (due to the `maxConcurrency` limit of 2).
- After completing the first two requests, the remaining requests are sent.
- The final aggregated result matches the expected array of responses.

## Running the Tests

Ensure you have all the necessary dependencies installed by running:

```bash
npm install
```

Then, run the tests with:

```bash
ng test
```

This command launches the test runner and executes all the tests, displaying the results in both the terminal and a browser.
