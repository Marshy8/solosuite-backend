import fs from "fs";
import { Credentials } from "google-auth-library";

const TOKEN_PATH = "/tmp/credentials.json";

export function loadTokens(): Credentials | null {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
}

export function saveTokens(tokens: Credentials): void {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}
