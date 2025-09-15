import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME || 'aws-1-eu-central-1.pooler.supabase.com',
  // port: process.env.RDS_PORT || 5432,
  port: 5432,
  username: process.env.RDS_USERNAME || 'postgres.fnangusjqldblofkfvma',
  password: process.env.RDS_PASSWORD || 'Pa$5word3112',
  database: process.env.RDS_DB_NAME || 'postgres',
  autoLoadEntities: true,
  //   entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
