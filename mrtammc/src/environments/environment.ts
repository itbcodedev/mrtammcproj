// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  icon: "M 33.636719 1.8457031 C 25.204986 1.8457031 17.120336 5.196114 11.158203 11.158203 C 5.19607 17.12029 1.8457031 25.205054 1.8457031 33.636719 C 1.8457031 42.068385 5.19607 50.155104 11.158203 56.117188 C 17.120336 62.079281 25.204986 65.429688 33.636719 65.429688 C 42.068452 65.429688 50.155188 62.079275 56.117188 56.117188 C 62.079321 50.1551 65.429688 42.068385 65.429688 33.636719 C 65.429688 29.335654 64.557443 25.125453 62.912109 21.240234 C 61.331976 17.508997 59.038121 14.078978 56.117188 11.158203 C 50.155188 5.196114 42.068452 1.8457031 33.636719 1.8457031 z M 34.013672 5.0976562 C 34.198205 5.0976562 34.638861 5.9779541 38.308594 13.732422 C 39.82326 16.934778 41.224449 19.88566 42.353516 22.267578 C 42.896449 23.412222 43.763564 25.244224 44.279297 26.335938 C 44.794897 27.427649 45.621234 29.16825 46.115234 30.207031 C 47.998968 34.183511 49.996888 38.398144 51.679688 41.951172 C 52.450487 43.585432 53.405942 45.628902 53.796875 46.482422 C 54.182208 47.335946 54.692448 48.441269 54.925781 48.9375 C 55.164448 49.433737 55.355469 49.87121 55.355469 49.904297 C 55.355469 49.943996 55.316904 50.010326 55.273438 50.056641 C 55.170238 50.155885 55.576273 50.440602 49.816406 46.265625 C 47.20534 44.373328 44.568411 42.460875 43.955078 42.017578 C 43.341478 41.574273 41.864189 40.50152 40.669922 39.634766 C 35.990455 36.240535 33.938468 34.759085 33.802734 34.679688 C 33.672334 34.600289 33.450247 34.759325 29.623047 37.630859 C 27.397314 39.298205 25.061767 41.044665 24.4375 41.507812 C 23.807767 41.977582 22.115482 43.246935 20.666016 44.332031 C 13.445882 49.737656 12.90334 50.136038 12.816406 50.056641 C 12.778406 50.010326 12.740234 49.922827 12.740234 49.863281 C 12.740234 49.797111 13.672893 47.77318 14.818359 45.351562 C 17.359026 39.992249 24.524552 24.859971 28.699219 16.046875 C 31.429752 10.28395 32.619271 7.7776393 33.335938 6.2558594 C 33.802604 5.2633887 33.899539 5.0976563 34.013672 5.0976562 z M 33.931641 7.8300781 L 15.998047 45.804688 L 33.847656 33.511719 C 33.847656 33.511719 52.457031 46.731544 52.457031 46.310547 C 52.457031 45.88955 33.931641 7.8300781 33.931641 7.8300781 z ",

  iconbase: 'assets/dist/icons/',
  configfiles: [
    {file: 'agency.txt', validatefile: 'file1', path: 'file1'},
    {file: 'calendar_dates.txt', validatefile: 'file1', path: 'file1'},
    {file: 'calendar.txt', validatefile: 'file1', path: 'file1'},
    {file: 'frequencies.txt', validatefile: 'file1', path: 'file1'},
    {file: 'periods.txt', validatefile: 'file1', path: 'file1'},
    {file: 'routes.txt', validatefile: 'file1', path: 'file1'},
    {file: 'shape_details.txt', validatefile: 'file1', path: 'file1'},
    {file: 'shapes.txt', validatefile: 'file1', path: 'file1'},
    {file: 'stop_times.txt', validatefile: 'file1', path: 'file1'},
    {file: 'stops.txt', validatefile: 'file1', path: 'file1'},
    {file: 'trips.txt', validatefile: 'file1', path: 'file1'}
  ],
  baseUrl: 'http://localhost:3000',
  baseSocket: 'ws://localhost:3000'

};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
