import { Logger } from '@shared/logger/logger';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class TypeOrmConnection {
  private static connection: Connection;

  private constructor() {}

  public static async getConnection(): Promise<Connection> {
    Logger.info('📗 Connecting to database...');

    try {
      if (!TypeOrmConnection.connection) {
        const postgresConnectionOptions =
          (await getConnectionOptions()) as PostgresConnectionOptions;

        TypeOrmConnection.connection = await createConnection(postgresConnectionOptions);
      }
    } catch (error) {
      Logger.error('📕 Error connecting to database');
      Logger.error(String(error));
    }

    Logger.info('📚 Connected to database');

    return TypeOrmConnection.connection;
  }

  public static async getTestConnection(): Promise<Connection> {
    if (!TypeOrmConnection.connection) {
      const postgresConnectionOptions =
        (await getConnectionOptions()) as PostgresConnectionOptions;

      TypeOrmConnection.connection = await createConnection({
        ...postgresConnectionOptions,
        database: 'user_crud_test',
      });
    }

    return TypeOrmConnection.connection;
  }

  public static async closeConnection(): Promise<void> {
    Logger.info('🎒 Disconnecting from database...');
    if (TypeOrmConnection.connection) {
      await TypeOrmConnection.connection.close();
    }
  }
}
