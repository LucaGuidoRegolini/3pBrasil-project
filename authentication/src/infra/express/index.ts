import 'express-async-errors';
import { HttpLogger } from '@shared/logger/http-logger';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { routes } from './routes';
import { Logger } from '@shared/logger/logger';

export class App {
  private app: express.Application;
  private server: http.Server;
  private port: number;

  private constructor(port: number) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;

    this.configure();
    this.routes();
    this.handleError();
  }

  public static getInstance(port: number): App {
    return new App(port);
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: '*',
      }),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use(HttpLogger.expressRequestLogger);
    this.app.use(routes);
  }

  private handleError(): void {
    this.app.use(HttpLogger.expressErrorLogger);
    this.app.use(HttpLogger.celebrateErrorLogger);
    this.app.use(HttpLogger.serverErrorLogger);
  }

  public start(): void {
    this.server.listen(this.port, () => {
      Logger.info(`🚀 App started on port ${this.port}`);
    });
  }
}
