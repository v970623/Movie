import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { oauth2Client } from "../config/googleAuth";
import { google } from "googleapis";

const JWT_SECRET = "12345678";
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
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Login failed" });
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

    // 获取用户信息
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // 确保必要的数据存在
    if (!userInfo.data.id || !userInfo.data.email) {
      throw new Error("Missing required user information");
    }

    // 先尝试通过 googleId 查找用户
    let user = await User.findOne({ googleId: userInfo.data.id });

    if (!user) {
      // 如果没找到，再尝试通过 email 查找
      user = await User.findOne({ email: userInfo.data.email });

      if (user) {
        // 如果找到了用户，更新其 googleId
        user.googleId = userInfo.data.id;
        await user.save();
      } else {
        // 如果用户完全不存在，才创建新用户
        const username =
          userInfo.data.name || userInfo.data.email.split("@")[0];
        user = await User.create({
          googleId: userInfo.data.id,
          email: userInfo.data.email,
          username,
          role: "public", // 设置默认角色
        });
      }
    }

    // 生成JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "12345678",
      { expiresIn: "1h" }
    );

    // 重定向到前端，带上token
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  } catch (error) {
    console.error("Google auth error:", error);
    res.redirect("http://localhost:3000/login?error=auth_failed");
  }
};
