import { Request, Response } from "express";
import Application, { IApplication } from "../models/applicationModel";
import fs from "fs";
import path from "path";
import { sendEmailNotification } from "../services/emailService";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const submitApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, content } = req.body;

    const application = new Application({
      userId: req.user.id,
      title,
      content,
      status: "new",
    });

    const savedApplication = await application.save();
    await sendEmailNotification("new_application", {
      title: savedApplication.title,
      content: savedApplication.content,
      username: req.user.username,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: savedApplication._id,
      application: savedApplication,
    });
  } catch (error) {
    console.error("Submission failed:", error);
    res.status(500).json({ error: "Submission failed" });
  }
};

export const updateApplicationStatus: AsyncRequestHandler = async (
  req,
  res
) => {
  const { applicationId, status } = req.body;

  const validStatuses = ["new", "pending", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  try {
    const application = await Application.findById(applicationId).populate(
      "userId",
      "email"
    );

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    application.status = status as IApplication["status"];
    const savedApplication = await application.save();

    if (application.userId && (application.userId as any).email) {
      try {
        await sendEmailNotification("status_update", {
          userId: application.userId,
          title: savedApplication.title,
          status: savedApplication.status,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    res.json({
      message: "Status updated successfully",
      application: {
        id: savedApplication._id,
        status: savedApplication.status,
      },
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(400).json({ error: "Update failed" });
  }
};

export const getApplications: AsyncRequestHandler = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve application list" });
  }
};

export const searchApplications: AsyncRequestHandler = async (req, res) => {
  const { keyword, status } = req.query;

  try {
    let query: any = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (req.user && req.user.role === "public") {
      query.userId = req.user.id;
    }

    const applications = await Application.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Application not found" });
    }

    if (
      req.user?.role !== "staff" &&
      application.userId.toString() !== req.user?.id
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: "Unauthorized to upload file" });
    }

    const filePath = `/uploads/${path.basename(req.file.path)}`;
    application.attachments = application.attachments || [];
    application.attachments.push(filePath);
    await application.save();

    res.json({
      message: "File uploaded successfully",
      filePath,
    });
  } catch (error) {
    console.error("File upload error:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "File upload failed" });
  }
};
