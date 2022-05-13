import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';

interface BookCategory extends Document {
  readonly name: string;
  readonly url: string;
  readonly parent: string;
}

type BookCategoryModel = Model<BookCategory>;

const BookCategorySchema = new Schema<BookCategory>(
  {
    name: { type: SchemaTypes.String, unique: true },
    url: { type: SchemaTypes.String, unique: true },
    parent: [{ type: SchemaTypes.ObjectId, required: false }],
  },
  { timestamps: true },
);

const createBookCategoryModel: (conn: Connection) => BookCategoryModel = (
  conn: Connection,
) =>
  conn.model<BookCategory>('BookCategory', BookCategorySchema, 'bookcategory');

export { BookCategory, BookCategoryModel, createBookCategoryModel };
