import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";
import { AppModule } from "./app.module";
import { LoggingInterceptor } from "./utils/logging.interceptor";
import HttpExceptionFilter from "./exceptions/http-exception.filter";
import * as cookieParser from "cookie-parser";
import * as config from "config";

const projectStart = async (): Promise<void> => {
  const PORT = config.get("port") || 3000;
  const logger = new Logger(projectStart.name);

  const { combine, colorize, timestamp, printf } = format;

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      format: combine(
        colorize({
          all: true,
          message: true,
          level: true,
        }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((msg) => {
          return `[${msg.level}] [${msg.timestamp}] - [${msg.context}] ${msg.message}`;
        })
      ),
      transports: [
        new transports.Console({
          level: "debug",
        }),
        new transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
      ],
    }),
  });

  const configProject = new DocumentBuilder()
    .setTitle("Real estate CRM")
    .setDescription("API documentation")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, configProject);
  SwaggerModule.setup("/api/docs", app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    exposedHeaders: "",
  });
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(PORT, () => logger.log(`Server started on port ${PORT}`));
};

projectStart();
