import nodemailer from "nodemailer";

const USER = process.env.EMAILSENDER_ADDRESS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: USER || "",
    pass: process.env.EMAILSENDER_PASS || "",
  },
});

export const emailSender = async ({
  email,
  body,
  subject,
}: {
  email: string;
  body: string;
  subject: string;
}) => {
  try {
    const options = {
      from: USER,
      to: email || "",
      subject: subject,
      html: body,
    };

    await transporter.sendMail(options).catch((err) => {
      console.log(err);
      throw new Error();
    });

    return {
      error: false,
    };
  } catch (err: any) {
    return {
      error: true,
      message: err.message || "Email sender fucked up",
    };
  }
};
