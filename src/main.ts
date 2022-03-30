import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as config from "config";
import { ValidationPipe } from "./pipes/validation.pipe";

const projectStart = async (): Promise<void> => {
  const PORT = config.get("port") || 3000;
  const app = await NestFactory.create(AppModule);

  const configProject = new DocumentBuilder()
    .setTitle("Real estate CRM")
    .setDescription("API documentation")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, configProject);
  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

projectStart();
