import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { MailService } from "./mailer.service";

import * as config from "config";

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: config.get("mailer.username"),
          pass: config.get("mailer.password"),
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>',
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
