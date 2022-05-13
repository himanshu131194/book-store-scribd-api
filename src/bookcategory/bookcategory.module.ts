import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BookcategoryController } from './bookcategory.controller';
import { BookcategoryService } from './bookcategory.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BookcategoryController],
  providers: [BookcategoryService],
})
export class BookcategoryModule {}
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
//     consumer
//       .apply(AuthenticationMiddleware)
//       .forRoutes(
//         { method: RequestMethod.POST, path: '/posts' },
//         { method: RequestMethod.PUT, path: '/posts/:id' },
//         { method: RequestMethod.DELETE, path: '/posts/:id' },
//       );
//   }
// }
