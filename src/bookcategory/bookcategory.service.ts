import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { BookCategory } from 'database/bookcategory.model';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { from, EMPTY, Observable, of } from 'rxjs';
import { Model, Types } from 'mongoose';
import { BOOKCATEGORY_MODEL } from '../database/database.constants';
import { CreateCategoryDto } from './create-category.dto';
import _ from 'lodash';
import { UpdateCategoryDto } from './update-category.dto';

@Injectable({ scope: Scope.REQUEST })
export class BookcategoryService {
  constructor(
    @Inject(BOOKCATEGORY_MODEL) private bookCategoryModel: Model<BookCategory>,
  ) {}

  findAll(
    keyword?: string,
    parent?: string,
    withsub?: string,
    skip = 0,
    limit = 10,
  ): Observable<BookCategory[]> {
    const filter = {};
    if (parent) {
      filter['parent'] = { $exists: true, $type: 'array', $eq: [] };
    }
    if (keyword) {
      filter['name'] = { $regex: '.*' + keyword + '.*' };
    }

    if (parent && withsub) {
      let match = withsub === 'all' ? {} : { _id: new Types.ObjectId(withsub) };
      return from(
        this.bookCategoryModel.aggregate([
          { $match: match },
          {
            $lookup: {
              from: 'bookcategory',
              localField: '_id',
              foreignField: 'parent',
              as: 'subcategories',
            },
          },
          { $skip: skip },
          { $limit: limit },
        ]),
      );
    }

    return from(
      this.bookCategoryModel.find(filter).skip(skip).limit(limit).exec(),
    );
  }

  findById(id: string): Observable<BookCategory> {
    return from(this.bookCategoryModel.findOne({ _id: id }).exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`post:$id was not found`)),
    );
  }

  save(data: CreateCategoryDto): Observable<BookCategory> {
    //console.log('req.user:'+JSON.stringify(this.req.user));
    const CreateCategory: Promise<BookCategory> = this.bookCategoryModel.create(
      {
        ...data,
        // createdBy: { _id: this.req.user.id },
      },
    );
    return from(CreateCategory);
  }

  update(id: string, data: UpdateCategoryDto): Observable<BookCategory> {
    return from(
      this.bookCategoryModel
        .findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        .exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`category:$id was not found`)),
    );
    // const filter = { _id: id };
    // const update = { ...data, updatedBy: { _id: this.req.user.id } };
    // return from(this.postModel.findOne(filter).exec()).pipe(
    //   mergeMap((post) => (post ? of(post) : EMPTY)),
    //   throwIfEmpty(() => new NotFoundException(`post:$id was not found`)),
    //   switchMap((p, i) => {
    //     return from(this.postModel.updateOne(filter, update).exec());
    //   }),
    //   map((res) => res.nModified),
    // );
  }

  deleteById(id: string): Observable<BookCategory> {
    return from(
      this.bookCategoryModel.findOneAndDelete({ _id: id }).exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`category:$id was not found`)),
    );
  }

  deleteAll(): Observable<any> {
    return from(this.bookCategoryModel.deleteMany({}).exec());
  }
}
