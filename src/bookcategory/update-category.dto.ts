import { IsArray, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCategoryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly url: string;

  @IsArray()
  readonly parent: Types.ObjectId[];
}
