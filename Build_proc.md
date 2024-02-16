## Control Angular generate output hash filename

>  In Angular build process, how to enforce the generated `main.js` filename, not `main-XXXXX.js` filename.

Angular uses Webpack under the hood for its build process, and by default, it appends a hash to the filename (like `main-XXXXX.js`) for cache busting purposes. This ensures that whenever the file changes, the filename changes as well, forcing the browser to download the new file instead of using the old one from cache.

If you want to generate a `main.js` file without the hash, you can modify the **angular.json** file in your project root. In the **angular.json** file, find the `projects -> your-project -> architect -> build -> configurations -> production` section (or the appropriate configuration section if you're not building for production), and set the `outputHashing` option to `none`.

```js
"projects": {
  "your-project": {
    "architect": {
      "build": {
        "configurations": {
          "production": {
            "outputHashing": "none"
          }
        }
      }
    }
  }
}
```

After making this change, running `ng build --configuration=production` (or the appropriate configuration) will generate a `main.js` file without the hash.

> Please note that turning off output hashing can have implications for caching. If your server is not configured to handle caching appropriately, users might not get the latest version of your application when you deploy updates.

## Why we want to enforce this main.js filename?

In this experiment, the `dash.component.ts` dynamically load the build bundle from other build process.  Since `ComponentFactoryResolver` is deprecated, so we **cannot** use the following way to dynamically load the build bundle.

```js
loadComponent() {
  // create a component factory from the HelloComponent URL
  const componentFactory = this.componentFactoryResolver.resolveComponentFactoryFromUrl('http://example.com/hello/main.js');

  // create a component instance using the factory and the injector
  const componentRef = componentFactory.create(this.injector);

  // attach the component to the view container
  this.container.insert(componentRef.hostView);
}
```

In `dash.component.ts`, we change to this createComponent() as follows,
```js
loadComponent$(component: any) {

    const path = './pams/main.js';

    import(path).then( ( pams ) => {

      const cmp = pams.AppComponent;

      // detach the current component from the view container
      // So we can insert a new one (replace)
      this.viewContainerRef.detach();

      const componentRef = this.viewContainerRef.createComponent( cmp );

      this.viewContainerRef.insert(componentRef.hostView);
    });
}
```

Both solutions are loaded other Angular bunle from `main.js` file.
 So we want to enforce the generated `main.js` filename, not `main-XXXXX.js` filename for the dynamic load bundle.

## Use context in @type/webpack-env to load main-xxxx.js file in dash.component.ts

The `@types/webpack-env` is a TypeScript declaration package for webpack's specific environment features. It provides TypeScript definitions for webpack-specific global variables and functions available in the runtime environment where your bundle is running.

One of these webpack-specific features is the context module API. In webpack, "**context**" refers to a directory that webpack uses as a base directory to resolve the relative paths of its entry points or loaders.

For example, if you have an entry point like this in your webpack configuration:

```js
module.exports = {
  //...
  entry: './src/app.js'
};
```

Webpack will look for the `app.js` file in the directory specified in the `context` option. If the context option is not set, webpack will use the current directory (i.e., the directory where the webpack command was run) as the context.

In the `@types/webpack-env` package, context is also used in the definition of the `require.context()` function, which is a feature provided by webpack to dynamically load modules from a specific directory. Here's an example:

```js
var context = require.context('./test', true, /\.test\.js$/);
context.keys().forEach(context);
```

In this example, `require.context()` loads all JavaScript files in the `test` directory that have a `.test.js` extension. The `context` variable is a function that can load a module given its relative path to the `test` directory.

## Encounter compiler error after added context

> `npm run build` returns the following error:
**TS2339: Property 'context' does not exist on type 'NodeRequire'**

In an Angular project, TypeScript definition files (`.d.ts`) are typically located at the root level of the project or inside a typings or types directory at the root level. However, they can technically be placed anywhere as long as they are included in the TypeScript compiler's path, which is defined in the `tsconfig.json` file.

In the root directory of your project, create a new file and name it `typings.d.ts`, add the following code.
```js
declare global {
  namespace NodeJS {
    interface Global {
      require: NodeRequire;
    }
  }

  interface NodeRequire {
    context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): any;
  }
}
```
This tells TypeScript that the `context` method is a function that takes **three parameters**: a string, a boolean, and a RegExp, and returns any type.   After you've added this declaration, TypeScript should stop complaining about the context method not existing on `NodeRequire`.

Open your `tsconfig.json` file, which should also be in the root directory of your project.  Add the following.
```js
{
  "compilerOptions": {
    // existing compiler options...
  },
  "include": [
    "typings.d.ts"
  ]
}
```
Now, TypeScript will include the `typings.d.ts` file when it compiles your project, and any type definitions or modifications you make in that file will be recognized by the TypeScript compiler.

### Do not work.   Try another method

After ensure `@types/webpack-env` is installed, add the following into `tsconfig.json` file.

```js
{
  "compilerOptions": {
    "types": ["webpack-env"]
  }
}
```

This tells TypeScript to include the webpack-env type definitions in your project.

> For isolating this setup, the previous "`include: typings.d.ts`" is commented out in `tsconfig.json` file.

### Do not work either.  Try anther method

Use a type assertion in TypeScript to tell the compiler to treat require as any type, which effectively bypasses the type checking for this specific usage.   Change `dash.component.ts` as follows:

```js
// From:
// const path = require.context('./pams', true, /main-.*\.js$/i).keys()[0];
    
const path:any = (require as any).context('./pams', true, /main-.*\.js$/i).keys()[0];
```

It works, no more compilation error.

> This tells TypeScript to treat `require` as any type, allowing you to call `context` or any other method without TypeScript complaining. Please note that **this is a workaround and should be used sparingly**, as it bypasses TypeScript's type checking.

To continue the testing, we keep the `compilerOptions : { "types": ["webpack-env"] }` in `tsconfig.json` file.

## Another run-time problem

> __require.context is not a function error in src/app/modules/lazy/dash.component.ts

1. The `require.context` is a webpack-specific feature. So we need to add the following code to `webpack.config.js` file.

2. `require.context` is a webpack-specific function that doesn't exist in `Node.js` environments. `require.resolveWeak` is a Node.js function that can resolve a module path without bundling the code.
  - `const path = require.resolveWeak('./pams/main-xxxx.js');`

### Can require.resolveWeak() do the search and match the file as context()?

`require.resolveWeak` unfortunately does not have the same file matching capabilities as `require.context`.

Some key differences:

- require.context() returns an array of all matching files, require.resolveWeak() returns a single resolved path

- require.context() can use regex to match file names, require.resolveWeak() takes an exact file path

- require.context() loads and caches all the matched files, require.resolveWeak() just resolves the path without loading the file

To get similar file matching behavior with require.resolveWeak(), you'd have to implement it yourself. A simple example:

```js
const fs = require('fs');
const path = require('path');

function resolveMainFile(dir, regex) {

  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (regex.test(file)) {
      return path.join(dir, file); 
    }
  }

  throw new Error('File not found');

}

const file = resolveMainFile('./pams', /main-.*\.js$/);
```
So require some extra code, but allows matching files with a regex pattern.

> This does not work.   The issue is how to include fs module.   **STOP**

## Back to hard code solution

```js
const path = './pams/main.js';

import( path ).then( ( pams ) => {

  const cmp = pams.AppComponent;
  this.viewContainerRef.detach();
  const componentRef = this.viewContainerRef.createComponent( cmp );
  this.viewContainerRef.insert(componentRef.hostView);
      
  }).catch((error) => {

    alert('Failed to load external component:'+ error);
    console.error('Failed to load external component:', error);

  });
```
