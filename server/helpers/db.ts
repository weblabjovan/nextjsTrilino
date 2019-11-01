import mongoose from 'mongoose';
import Keys from '../keys';

export default async () => {
  if (mongoose.connections[0].readyState) return;
  // Using new database connection
  const resolveKeys = await Keys;
  const myKeys = resolveKeys.default;
  
  await mongoose.connect(myKeys['mongoURI'], {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};