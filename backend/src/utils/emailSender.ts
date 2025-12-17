import { Resend } from "resend";
import { render } from "@react-email/render";
import OTPEmail from "../email/OTPEmail";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendOtpParams {
  to: string;
  otp: string;
  role: string;
  expiryMinutes?: number;
}

export const sendOtpEmail = async ({
  to,
  otp,
  role,
  expiryMinutes = 15,
}: SendOtpParams) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const html: string = await render(
    OTPEmail({
      otp,
      role,
      expiryMinutes,
    })
  );

  const result = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: `Your ${role} password reset code`,
    html,
  });

  return result;
};
