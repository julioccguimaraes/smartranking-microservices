import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('[Interceptor] Antes da requisição.');

    // normalmente usado no processo de depuração

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            '[Interceptor] Depois da requisição (tempo da requisição): ' +
              (Date.now() - now) +
              'ms',
          ),
        ),
      );
  }
}
