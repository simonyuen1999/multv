# Development Note

## What are the benefits of using code splitting in **Webpack**?

Code splitting is a feature offered by Webpack that can greatly improve the performance of your applications. Here are some of the benefits:

1. **Improved Load Time**: By splitting your code into multiple chunks that can be loaded on demand, your users can see the initial page load much faster, because they only need to download the initial chunk to start using your app.

2. **On-Demand Loading**: Code for features that aren't needed right away (like a dialog box or a complex form) can be loaded on demand, which means your users only download code for features they actually use.

3. **Cache Efficiency**: Once a chunk has been downloaded, it can be cached by the browser. This means that if two pages share a chunk, it only needs to be downloaded once.

4. **Parallel Downloads**: Modern browsers can download multiple files in parallel, so if your app is split into multiple smaller files, the browser can load your app faster.

5. **Long-Term Caching**: If you use chunk hashes, any change in your codebase won't invalidate the entire cache, but only the chunks that changed. This can greatly improve load times for returning users.

# Webpack note

## How **@webpack.config.js** works in the lazy load process

> Explain how **@src\app\app.routes.ts** lazy load **@src\app\modules\lazy\lazy.module.ts**, and then load **@src\app\modules\lazy\lazy-routing.module.ts**, then load **@src\app\modules\lazy\tch\tch.component.ts**. How is the **@webpack.config.js** file apply or involve in the process?

Here is how the lazy loading would work with **webpack.config.js**:

In **app.routes.ts**:
```js
// Lazy load LazyModule
{
  path: 'lazy',
  loadChildren: () => import('./modules/lazy/lazy.module').then(m => m.LazyModule) 
}
```

In **lazy.module.ts**:
```js
// Imports LazyRoutingModule
@NgModule({
  imports: [
    CommonModule,
    LazyRoutingModule 
  ]
})
export class LazyModule {}
```

In **lazy-routing.module.ts**:
```js
// Sets up route to TchComponent
const routes = [
  {
    path: '',
    component: TchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class LazyRoutingModule {}
```

When the '/lazy' route is loaded, the **LazyModule** is imported dynamically using webpack's code splitting.

Inside **LazyModule**, the **LazyRoutingModule** sets up the default route to the **TchComponent**.

This is where **webpack.config.js** comes in:
```js
output: {
  chunkLoadingGlobal: 'webpackJsonp' 
},
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}  
```
This tells webpack to split the **LazyModule** into a separate bundle that can be loaded dynamically using **webpackJsonp**.

So the routing goes from **AppRoutes** -> **LazyModule** -> **LazyRouting** -> **TchComponent**, loading each piece dynamically with webpack.

## What is **webpackJsonp** mean in **@webpack.config.js**

The webpackJsonp in webpack.config.js is a **globally exposed variable name** that webpack uses to asynchronously load chunks (bundles) on demand.

When you configure:
```js
output: {
  chunkLoadingGlobal: 'webpackJsonp'
}
```
In webpack, this defines '**webpackJsonp**' as the global variable that will be used to asynchronously load chunks.

When a chunk needs to be loaded dynamically (like for lazy loaded modules), webpack will add a ...

## What is "webpack's code splitting" mean?

"**Webpack's code splitting**" refers to webpack's ability to split your application code into separate bundles that can be loaded on demand.

The key benefits of code splitting with webpack are:

- **Lazy Loading** - You can split code into separate bundles and load them only when needed, rather than everything upfront. This improves initial load time.

- **Caching** - Split bundles can be cached separately, taking advantage of browser caching rather than re-downloading everything.

- **Manageable Chunks** - Splitting code allows you to group functionality into logical chunks rather than one large bundle.

Webpack implements code splitting in two main ways:

1. **Dynamic Imports** - Using import() syntax tells webpack to split that module into a separate chunk that can be loaded dynamically.

2. **Entry Points** - Defining multiple entry points allows webpack to split code into separate bundles based on the entry structure.

Under the hood, webpack analyzes the application code to determine split points and optimize the chunks. The output is multiple smaller bundles rather than one large file.

So in summary, "webpack's code splitting" refers to webpack's built-in functionality to split your code into multiple optimized bundles that can be loaded dynamically for performance and caching benefits. This is crucial for implementing techniques like lazy loading.

## Split the code into multiple bundles

> How to split the **@src\app\modules\lazy\lazy.module.ts** and **@src\app\modules\lazy\tch\tch.component.ts** into different build and different bundle? And, how to deploy this separated bundle into the production directory?

Here is one way to split LazyModule and TchComponent into separate builds and bundles with deployment:

In **webpack.config.js**,
- Define two entry points:
```js
entry: {
  main: './src/main.ts',
  lazy: './src/app/modules/lazy/lazy.module.ts'
}
```
- Configure output for separate bundle names:
```js
output: {
  filename: '[name].bundle.js'
}
```
- Add entryOnly setting:
```js
optimization: {
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          // put external deps in vendor bundle
          if (module.context.indexOf('node_modules') !== -1) {
            return 'vendor';
          }
        }
      }
    }
  }
}
```
1. Build will now generate main.bundle.js and lazy.bundle.js

2. For deployment, copy bundles into respective folders:
```text
dist/
  - main/
    - main.bundle.js
  - lazy/
    - lazy.bundle.js
```
Now the main and lazy bundles are separated in both build and deployment.

## Explain this webpack.config.js file

```js
const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    lazy: './src/app/modules/lazy/lazy.module.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js', 
    chunkLoadingGlobal: 'webpackJsonp' // Important for lazy loading
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // put external deps in vendor bundle
            if (module.context.indexOf('node_modules') !== -1) {
              return 'vendor';
            }
          }
        }
      }
    }
  },
};
```
This **webpack.config.js** file is a configuration file for Webpack, a **static module bundler** for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles.

Let's break down the key parts of this configuration:

1. **entry**: This is the entry point for webpack. The property names (main and lazy) are the names of the bundles that webpack will output. The property values are the relative paths to the TypeScript files that serve as the entry points for those bundles.

2. **output**: This is where the bundled files will be output. The **path** property is the directory where the output files will be placed. The **filename** property is the name of the output bundle. The **chunkFilename** property is the name of non-entry chunk files. The **chunkLoadingGlobal** property is the global variable used by webpack for loading chunks, which is important for lazy loading.

3. **optimization**: This section is used to specify different optimization steps that webpack will take when creating the final bundles. The **runtimeChunk** property is set to '**single**' to create a single runtime bundle for all chunks. The **splitChunks** property is used to define various conditions for how webpack should split your code into chunks. The **cacheGroups** property is used to override the default optimization configuration. In this case, it's used to put all code from node_modules into a separate 'vendor' bundle.

The **vendor** cache group uses a **test** function to determine which modules should be included in the vendor bundle. If the module's context contains '**node_modules**', it's included in the vendor bundle.

This configuration is a common pattern for Angular applications, where you want to separate your application code (in the '**main**' bundle) from your vendor code (in the '**vendor**' bundle), and also support lazy loading of certain modules (like the '**lazy**' module in this case).

## What is the build command to generate main.bundle.js and lazy.bundle.js files?
Add webpack to system
> npm install -g webpack

> npm install -g webpack-cli

Add webpack-cli into the project
> yarn add -D webpack-cli

1. **Single Build Command**

With the webpack config split into entries for main and lazy, you can generate both bundles with a single build command:
```console
webpack --config webpack.config.js
```
This will compile and output both bundle files in one go.

2. **Separate Builds**

To compile them separately, you can target each entry point individually:
```console
// Build only main
webpack --config webpack.config.js --entry main

// Build only lazy 
webpack --config webpack.config.js --entry lazy
```
This will compile each entry into its own bundle output.

The key flags are:

+ **--config** - Points to the webpack config file
+ **--entry** - Specifies which entry point to build

So with either a single build, or separate targeted builds, you can generate the main and lazy bundles separately.

## 2024-Feb-13 Stop

The following commands return compilation error.  Take a BREAK.
```
webpack --config webpack.config.js
webpack --config webpack.config.js --entry main
webpack --config webpack.config.js --entry lazy
```