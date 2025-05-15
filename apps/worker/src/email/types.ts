import { SendMailOptions } from "nodemailer";

export interface Transporter {
  sendMail: (opts: SendMailOptions) => Promise<any>;
}