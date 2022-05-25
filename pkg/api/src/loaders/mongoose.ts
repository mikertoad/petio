import { Db } from 'mongodb';
import mongoose from 'mongoose';

import { config } from '@/config/index';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.get('db.url'), {
    autoCreate: true,
    autoIndex: true,
  });

  return connection.connection.db;
};
