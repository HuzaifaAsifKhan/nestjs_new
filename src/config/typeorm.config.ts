import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'aws-1-eu-central-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.fnangusjqldblofkfvma',
  password: 'Pa$5word3112',
  database: 'postgres',
  autoLoadEntities: true,
  //   entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
