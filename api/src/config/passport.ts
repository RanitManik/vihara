import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user";
import { env } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: env.BACKEND_URL
        ? `${env.BACKEND_URL}/api/auth/google/callback`
        : "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = new User({
              googleId: profile.id,
              email: profile.emails?.[0].value,
              firstName: profile.name?.givenName || "First Name",
              lastName: profile.name?.familyName || "Last Name",
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

// We don't really need serialize/deserialize if we're only using Passport for the OAuth flow and then using our own JWT
passport.serializeUser((user: Express.User, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
