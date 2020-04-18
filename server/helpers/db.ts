import mongoose from 'mongoose';
import Keys from '../keys';
import { getServerHost } from './general';

export default async (host: string) => {
  if (mongoose.connections[0].readyState) return;
  const theHost = getServerHost(host);
  
  const connection = theHost === 'prod' ? Keys.MONGO_URI_PROD : Keys.mongoURI;

  // Using new database connection
  await mongoose.connect(connection, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};