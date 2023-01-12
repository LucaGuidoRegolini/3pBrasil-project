import 'dotenv/config';

export const app_port = process.env.APP_PORT;

export const jwt_secret = process.env.JWT_SECRET;

export const app_environment = process.env.APP_ENVIRONMENT;

export const kafka_brokers = process.env.KAFKA_BROKER || '';

export const kafka_topic_modify_user = process.env.KAFKA_TOPIC_MODIFY_USER || '';
