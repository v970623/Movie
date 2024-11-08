import { Request, Response } from "express";
import MovieApplication from "../models/movieApplicationModel";
import { handleError } from "../utils/errorHandler";

// Submit a new movie application
export const submitApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { posterUrl, ...rest } = req.body;
    const applicationData = { ...rest, userId: req.user?.id, posterUrl };

    if (posterUrl?.length > 1000000) {
      return handleError(
        res,
        413,
        "Poster URL payload too large. Please compress the image or increase the server's request size limit."
      );
    }

    const application = await MovieApplication.create(applicationData);
    res.status(201).json({ status: "success", data: application });
  } catch (error) {
    handleError(res, 400, "Failed to submit application", error);
  }
};

// Get all applications
export const getAllApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applications = await MovieApplication.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json({ status: "success", data: applications });
  } catch (error) {
    handleError(res, 400, "Failed to retrieve applications", error);
  }
};

// Update application status
export const updateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const application = await MovieApplication.findByIdAndUpdate(
      applicationId,
      { status: req.body.status },
      { new: true }
    );

    if (!application) {
      return handleError(res, 404, "Application not found");
    }

    res.json({ status: "success", data: application });
  } catch (error) {
    handleError(res, 400, "Failed to update application status", error);
  }
};
