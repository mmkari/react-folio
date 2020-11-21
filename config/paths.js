const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
  appBuild: resolveApp("dist-examples"), 
  appConfig: resolveApp("config"),
  appHtml: resolveApp("examples/index.html"),
  appIndexJs: resolveApp("examples/index.jsx"), // Main entry point (example app)
  appSrc: resolveApp("src"), // source folder (library files)
  appExamples:resolveApp("examples"),  // Examples source
  libIndexJs: resolveApp("src/index.tsx"), // Main entry point (library module)
  libBuild: resolveApp("dist") // Library CJS bundle outDir
};