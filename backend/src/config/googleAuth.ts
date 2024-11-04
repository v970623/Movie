import { OAuth2Client } from "google-auth-library";

export const GOOGLE_CLIENT_ID =
  "48504898141-2jvc6j1u3v68bu8jgmljktplj794l5fk.apps.googleusercontent.com";
export const GOOGLE_CLIENT_SECRET = "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";

export const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:5001/api/auth/google/callback"
);
