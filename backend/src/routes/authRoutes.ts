import { Router } from "express";
import { register, login } from "../controllers/authController";
import passport from "passport";
import { generateToken } from "../utils/tokenUtils";

const router = Router();
const BASE_URL = "http://localhost:3000";

router.post("/register", register);

router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${BASE_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = generateToken(user);
      res.redirect(`${BASE_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect(`${BASE_URL}/login?error=auth_failed`);
    }
  }
);

export default router;
