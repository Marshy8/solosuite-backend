import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test files share one SQLite file at /tmp/app.sqlite, so they must
    // run one at a time — parallel workers would race on seeding it.
    fileParallelism: false,
    setupFiles: ["./tests/setup.ts"],
  },
});
