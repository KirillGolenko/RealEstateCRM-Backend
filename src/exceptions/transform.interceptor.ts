import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        statusCode: ctx.statusCode,
        timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        data,
      }))
    );
  }
}
