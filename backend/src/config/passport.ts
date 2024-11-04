import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel";

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        scope: ["email", "profile"],
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://your-domain.com/api/auth/google/callback"
            : "http://localhost:5001/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          // Find or create user
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create new user if not exists
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              username: profile.displayName,
              role: "public", // Default role
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};

export default configurePassport;
