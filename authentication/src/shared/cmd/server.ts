import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import { Logger } from '@shared/logger/logger';
import { TypeOrmConnection } from '@infra/database/typeOrmConnection';

(async () => {
  Logger.init();
  Logger.info('✅ Server started');

  TypeOrmConnection.buildConnection().then(() => {
    const express_port = Number(process.env.APP_PORT) || 3000;

    import('@infra/express').then(({ App }) => {
      const server = App.getInstance(express_port);
      server.start();
    });
  });

  process.on('SIGINT', async () => {
    Logger.info('🛑 Server stopped');
    await TypeOrmConnection.closeConnection();
    process.exit(0);
  });
})();
