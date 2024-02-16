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