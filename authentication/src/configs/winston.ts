import { resolve } from 'path';

export const options = {
  file: {
    filename: `${resolve(__dirname, '..', '..')}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 1,
    colorize: true,
  },
  error: {
    level: 'error',
    filename: `${resolve(__dirname, '..', '..')}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 1,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
