import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import * as dayjs from "dayjs";
import ResponseExcaption from "./exception.interface";

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const responseExcaption = exception.getResponse() as ResponseExcaption;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      message: responseExcaption.message ?? message,
      timestamp: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    });
  }
}
