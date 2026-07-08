// Vite's `?worker` suffix imports (https://vite.dev/guide/features#import-with-query-suffixes)
declare module '*?worker' {
  const workerConstructor: new () => Worker
  export default workerConstructor
}
