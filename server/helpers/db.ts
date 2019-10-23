import mongoose from 'mongoose';
import Keys from '../keys';

export default async () => {
  if (mongoose.connections[0].readyState) return;
  // Using new database connection
  await mongoose.connect(Keys.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};