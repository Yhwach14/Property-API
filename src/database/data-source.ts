import { config } from 'dotenv';
import * as path from 'path';

config({
  path: path.resolve(
    __dirname,
    '../..',
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  ),
});

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);