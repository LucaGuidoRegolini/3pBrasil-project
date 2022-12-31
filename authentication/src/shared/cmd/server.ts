import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import { App } from '@infra/express';
import { Logger } from '@shared/logger/logger';
import { TypeOrmConnection } from '@infra/database/typeOrmConnection';

(async () => {
  Logger.init();
  Logger.info('✅ Server started');
  const express_port = Number(process.env.APP_PORT) || 3000;
  const server = App.getInstance(express_port);

  await TypeOrmConnection.getConnection();
  server.start();

  process.on('SIGINT', async () => {
    Logger.info('🛑 Server stopped');
    await TypeOrmConnection.closeConnection();
    process.exit(0);
  });
})();
