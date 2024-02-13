# Multv

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Another build command `ng build --output-hashing=bundles` is used to build the project with hashed file names.

Or, run `npm run build --output-hashing=bundles` to build.

### --output-hashing=bundles parameter

**Pros**

 - ***Cache Busting***: When the file contents change, the hash changes as well. This forces the browser to download the new version of the file, instead of serving the old one from cache. This is particularly useful when you deploy updates to your application, as it ensures that users always get the latest version.

- ***Efficient caching***: If a chunk hasn't changed between builds, it will keep the same hash, so the browser can serve it from cache. This can significantly improve load times for returning users.

**Cons**

- ***Increased build time***: Calculating hashes for the files can increase the build time, especially for larger projects.

- ***Increased complexity***: If you're manually managing your deployment or have a custom setup, you'll need to account for the changing file names.

> If you don't use **--output-hashing=bundles**, the output files will **not** have hashes in their names. This might result in browsers **serving stale versions of your files from cache**, but it can simplify deployment in certain scenarios and slightly reduce build times.

## Running on http-serve

Run `npx http-server dist\multv\browser` to run the project on http-server.  Access http://127.0.0.1:8081 to test the program. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
