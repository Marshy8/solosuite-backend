import { google } from "googleapis";
import { env } from "../../config/env";
import { loadTokens } from "../token_services/tokenStore.service";

export const oauth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleRedirectUri,
);

const existingTokens = loadTokens();
if (existingTokens) {
  oauth2Client.setCredentials(existingTokens);
}
