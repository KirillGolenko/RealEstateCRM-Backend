import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import * as config from "config";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMessage(email: string, message: string) {
    this.mailerService.sendMail({
      to: email,
      from: config.get("mailer.username"),
      subject: "Verify User",
      html: message,
    });
  }
}
