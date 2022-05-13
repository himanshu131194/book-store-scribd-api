import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  Scope,
} from '@nestjs/common';
import { Response } from 'express';
import { from, map, Observable } from 'rxjs';
import { ParseObjectIdPipe } from 'shared/pipe/parse-object-id.pipe';
import { BookcategoryService } from './bookcategory.service';
import { BookCategory } from 'database/bookcategory.model';
import { CreateCategoryDto } from './create-category.dto';

@Controller({ path: 'bookcategory', scope: Scope.REQUEST })
export class BookcategoryController {
  constructor(private bookcategoryService: BookcategoryService) {}

  @Get('')
  getAllCategories(
    @Query('name') keyword?: string,
    @Query('parent') parent?: string,
    @Query('withsub') withsub?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
  ): Observable<BookCategory[]> {
    return this.bookcategoryService.findAll(
      keyword,
      parent,
      withsub,
      skip,
      limit,
    );
  }

  @Post('')
  createCattegory(
    @Body() post: CreateCategoryDto,
    @Res() res: Response,
  ): Observable<Response> {
    return this.bookcategoryService.save(post).pipe(
      map((category) => {
        return res
          .location('/bookcategory/' + category._id)
          .status(201)
          .send();
      }),
    );
  }

  @Get(':id')
  getCategoryById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Observable<BookCategory> {
    return this.bookcategoryService.findById(id);
  }

  @Delete(':id')
  deletePostById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() res: Response,
  ): Observable<Response> {
    return this.bookcategoryService.deleteById(id).pipe(
      map((category) => {
        return res.status(204).send();
      }),
    );
  }
}
