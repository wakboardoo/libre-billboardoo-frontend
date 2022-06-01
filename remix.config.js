/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // ignoredRouteFiles: ["**/.*"],
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}
