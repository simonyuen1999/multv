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
