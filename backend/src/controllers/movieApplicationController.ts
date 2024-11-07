import { Request, Response } from "express";
import MovieApplication from "../models/movieApplicationModel";

//Submit new movie application
export const submitApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { posterUrl, ...rest } = req.body;
    const applicationData = {
      ...rest,
      userId,
      posterUrl,
    };

    if (posterUrl && posterUrl.length > 1000000) {
      return res.status(413).json({
        status: "error",
        message:
          "Poster URL payload too large. Please compress the image or increase the server's request size limit.",
      });
    }

    const application = await MovieApplication.create(applicationData);

    res.status(201).json({
      status: "success",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to submit application",
      error: error,
    });
  }
};

//Fetch all applications
export const getAllApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applications = await MovieApplication.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: applications,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to fetch applications",
      error: error,
    });
  }
};

//Update application status
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await MovieApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json({
      status: "success",
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to update application status",
      error: error,
    });
  }
};
