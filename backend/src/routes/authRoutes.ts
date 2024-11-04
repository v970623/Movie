import { Router, Request, Response } from "express";
import {
  register,
  login,
  googleAuth,
  googleCallback,
} from "../controllers/authController";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", (req, res) => {
  register(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false,
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "12345678",
        { expiresIn: "1h" }
      );

      res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect("http://localhost:3000/login?error=auth_failed");
    }
  }
);

export default router;
