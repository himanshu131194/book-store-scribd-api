import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri:
    process.env.MONGODB_URI ||
    'mongodb+srv://bookstore:wBNyy0ThzZZMJgv6@bookstore.z7y3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
}));
