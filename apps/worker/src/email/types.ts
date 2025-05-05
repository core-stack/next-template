import { SendMailOptions } from "nodemailer";

export interface MailOptionsWithTemplate extends SendMailOptions {
  template: string;
  context: any;
}

export interface Transporter {
  sendMail: (opts: MailOptionsWithTemplate) => Promise<any>;
}