import { Request, Response } from "express";
import User from "../models/userModel";
import { oauth2Client } from "../config/googleAuth";
import { google } from "googleapis";
import { generateToken } from "../utils/tokenUtils";
import { handleError } from "../utils/errorHandler";

const STAFF_CODE = "9999";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const register: AsyncRequestHandler = async (req, res) => {
  const { username, password, email, code } = req.body;
  try {
    if (!password) {
      res.status(400).json({ error: "Password is required for registration" });
      return;
    }

    const role = code === STAFF_CODE ? "staff" : "public";

    const user = new User({
      username,
      password,
      email,
      role,
    });

    await user.save();
    res.status(201).json({
      message: "User registration successful",
      role,
    });
  } catch (error: any) {
    handleError(res, 500, "Registration failed", error);
  }
};

export const login: AsyncRequestHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (password) {
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
    }
    const token = generateToken(user);

    res.json({
      token,
      role: user.role,
    });
  } catch (error: any) {
    handleError(res, 500, "Login failed", error);
  }
};

export const googleAuth = async (req: Response, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data.id || !userInfo.data.email) {
      throw new Error("Missing required user information");
    }

    let user = await User.findOne({ googleId: userInfo.data.id });

    if (!user) {
      user = await User.findOne({ email: userInfo.data.email });

      if (user) {
        user.googleId = userInfo.data.id;
        await user.save();
      } else {
        const username =
          userInfo.data.name || userInfo.data.email.split("@")[0];
        user = await User.create({
          googleId: userInfo.data.id,
          email: userInfo.data.email,
          username,
          role: "public",
        });
      }
    }

    const token = generateToken(user);

    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  } catch (error: any) {
    handleError(res, 500, "Google auth error", error);
    res.redirect("http://localhost:3000/login?error=auth_failed");
  }
};
