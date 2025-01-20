import {Injectable,NestInterceptor,ExecutionContext,CallHandler,} from '@nestjs/common';
import { map } from 'rxjs/operators';
  
@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
          map((data) => this.processData(data)),
        );
    }
      
    private processData(data: any): any {
        if (Array.isArray(data)) {
          return data.map((item) => this.processData(item));
        }
        if (data && typeof data === 'object') {
            const processed = { ...data };
            if ('password' in processed) {
                delete processed.password;
            }
        for (const key in processed) {
            if (typeof processed[key] === 'object') {
              processed[key] = this.processData(processed[key]);
            }
          }
          return processed;
        }
        return data;
    }
}