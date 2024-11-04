import nodemailer from "nodemailer";
import { IUser } from "../models/userModel";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
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
    case "status_update":
      return {
        subject: "Application Status Update",
        html: `
          <h2>Your Application Status Has Been Updated</h2>
          <p>Title: ${data.title}</p>
          <p>New Status: ${data.status}</p>
          <p>Update Time: ${new Date().toLocaleString()}</p>
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
  data: { userId?: IUser } & Record<string, any>
) => {
  try {
    const template = getEmailTemplate(type, data);

    let recipient: string;
    if (type === "new_application") {
      const adminEmail = emailConfig.auth.user;
      if (!adminEmail) {
        throw new Error("Admin email not configured");
      }
      recipient = adminEmail;
    } else if (type === "status_update" && data.userId?.email) {
      recipient = data.userId.email;
    } else {
      throw new Error("Invalid email type or missing recipient information");
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
