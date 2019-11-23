import mongoose from 'mongoose';

import User from './user';
import Message from './message';
import Team from './team';
import Score from './score';

let { DB_USER, DB_HOST, DB_NAME, DB_PORT, DB_PASSWORD } = process.env;

const connectDb = () => {
  if (DB_HOST && DB_NAME) {
    const connectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);
    
    return mongoose.connect(
      connectionString
    );
  }
};

const models = { User, Message, Team, Score };

export { connectDb };

export default models;
