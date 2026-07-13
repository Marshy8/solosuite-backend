import fs from "fs";

// Runs before each test file. Deleting the DB here guarantees every test
// file starts from a fresh, seeded database — the seed is not idempotent,
// so re-importing the connection against a leftover file would crash.
if (fs.existsSync("/tmp/app.sqlite")) {
  fs.unlinkSync("/tmp/app.sqlite");
}

// config/env.ts throws on missing Google credentials. Tests never call
// Google's APIs, so dummies are fine; real values from the shell still win.
process.env.GOOGLE_CLIENT_ID ??= "test-client-id";
process.env.GOOGLE_CLIENT_SECRET ??= "test-client-secret";
process.env.GOOGLE_REDIRECT_URI ??= "http://localhost:3000/oauth2callback";
