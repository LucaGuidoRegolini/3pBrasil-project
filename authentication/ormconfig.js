const baseFolder = process.env.APP_ENV === 'production' ? './dist' : './src';
const extensions = process.env.APP_ENV === 'production' ? '.js' : '.ts';

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'sql_db',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'test',
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'docker',
    entities: [`${baseFolder}/modules/**/entities/*${extensions}`],
    migrations: ['./src/infra/database/migrations/*.ts'],
    cli: {
      migrationsDir: './src/infra/database/migrations/',
    },
  },
];
