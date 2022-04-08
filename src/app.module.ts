import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mailer/mailer.module";
import { GoogleModule } from "./google/google.module";
import { TasksModule } from "./tasks/tasks.module";
import { EventsModule } from './events/events.module';
import * as config from "config";

@Module({
  controllers: [],
  providers: [],
  imports: [
    Logger,
    UsersModule,
    AuthModule,
    MailModule,
    GoogleModule,
    TasksModule,
    TypeOrmModule.forRoot({ ...config.get("database.postgresql") }),
    EventsModule,
  ],
})
export class AppModule {}
