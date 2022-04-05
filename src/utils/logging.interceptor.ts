import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<object> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        this.logger.debug(
          `${response.req.method} ${response.statusCode} ${response.req.url} ${
            Date.now() - now
          }ms`
        )
      ),
      catchError((error) => {
        this.logger.error(
          `${response.req.method} ${error.status} ${response.req.url} ${
            Date.now() - now
          }ms`
        );
        return throwError(error);
      })
    );
  }
}
