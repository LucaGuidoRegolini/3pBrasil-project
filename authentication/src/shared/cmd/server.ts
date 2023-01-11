import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import { Logger } from '@shared/logger/logger';
import { TypeOrmConnection } from '@infra/database/typeOrmConnection';
import { express_port_default } from '@configs/express';
import { app_port } from '@configs/environment_variable';

(async () => {
  Logger.init();
  Logger.info('✅ Server started');

  TypeOrmConnection.buildConnection().then(() => {
    const express_port = Number(app_port) || express_port_default;

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
