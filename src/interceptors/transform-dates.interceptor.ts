import {Injectable,NestInterceptor,ExecutionContext,CallHandler,} from '@nestjs/common';
import { map } from 'rxjs/operators';
  
@Injectable()
export class TransformDaetesInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
          map((data) => this.transformedData(data)),
        );
    }
      
    private transformedData(data: any): any {
        if (Array.isArray(data)) {
          return data.map((item) => this.transformedData(item));
        }
        if (data && typeof data === 'object') {
            const transformed = { ...data };
        for (const key in transformed) {
            if (typeof transformed[key] === 'object') {
                if(transformed[key] instanceof Date){
                    transformed[key] = this.transformedData(transformed[key].toISOString());
                }
            }
          }
          return transformed;
        }
        return data;
    }
}