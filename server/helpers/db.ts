import mongoose from 'mongoose';
import Keys from '../keys';

export default async (host: string) => {
  if (mongoose.connections[0].readyState) return;
  console.log(host);
  const connection = host === 'trilino.com' ? Keys.MONGO_URI_PROD : Keys.mongoURI;

  // Using new database connection
  await mongoose.connect(connection, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};