// Passenger (cPanel "Setup Node.js App") entry point. Plain CommonJS on purpose —
// Passenger just runs this file with Node; it does not run a TypeScript build step.
// Run `npm run build` first so dist/server.js exists. See DEPLOYMENT.md.
require("./dist/server.js");
