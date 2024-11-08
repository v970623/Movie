import nodemailer from "nodemailer";
import User from "../models/userModel";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.MAIL_USERNAME ||
  !process.env.MAIL_PASSWORD ||
  !process.env.MAIL_TO
) {
  throw new Error("Missing mail credentials in environment variables");
}

const emailConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

transporter
  .verify()
  .then(() => console.log("Email service configuration verified"))
  .catch((err) => console.error("Email service configuration failed:", err));

const getEmailTemplate = (type: string, data: any) => {
  switch (type) {
    case "new_application":
      return {
        subject: "New Application Notification",
        html: `
          <h2>New Application Submitted</h2>
          <p>Applicant: ${data.username}</p>
          <p>Title: ${data.title}</p>
          <p>Content: ${data.content}</p>
          <p>Submission Time: ${new Date().toLocaleString()}</p>
        `,
      };
    case "rental_confirmation":
      return {
        subject: "Movie Rental Confirmation",
        html: `
          <h2>Your Movie Rental Confirmation</h2>
          <p>Movie: ${data.movieTitle}</p>
          <p>Start Date: ${new Date(data.startDate).toLocaleDateString()}</p>
          <p>End Date: ${new Date(data.endDate).toLocaleDateString()}</p>
          <p>Total Price: $${data.totalPrice.toFixed(2)}</p>
        `,
      };
    default:
      return {
        subject: "System Notification",
        html: `<p>${data.message}</p>`,
      };
  }
};

export const sendEmailNotification = async (
  type: string,
  data: { userId?: string } & Record<string, any>
) => {
  try {
    const template = getEmailTemplate(type, data);
    const adminEmail = process.env.MAIL_FROM;

    if (!adminEmail) {
      throw new Error("Admin email not configured");
    }

    const recipient =
      type === "new_application"
        ? adminEmail
        : type === "rental_confirmation" && data.userId
        ? (await User.findById(data.userId))?.email
        : null;

    if (!recipient) {
      throw new Error("Invalid email type or missing recipient information");
    }

    const mailOptions = {
      from: adminEmail,
      to: recipient,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
