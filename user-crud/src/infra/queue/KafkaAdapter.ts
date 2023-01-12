import { Consumer, Kafka, Producer } from 'kafkajs';
import { QueueInterface } from './queueInterface';
import { kafka_brokers } from '@configs/environment_variable';
import { Either, SuccessfulResponse, left, right } from '@shared/either';
import { BadRequestError, NotFoundError } from '@shared/errors';
import { Logger } from '@shared/logger/logger';

export class KafkaAdapter implements QueueInterface {
  private static instance: KafkaAdapter;
  private producer: Producer;
  private consumer: Consumer;
  private kafka: Kafka;
  private events: { [key: string]: string[] } = {};

  private constructor() {
    this.kafka = new Kafka({
      clientId: 'user-crud',
      brokers: [kafka_brokers],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'user-crud-group' });
  }

  public static build(): void {
    if (KafkaAdapter.instance) return;

    Logger.info('🐛 Building Kafka Adapter');
    KafkaAdapter.instance = new KafkaAdapter();
    return;
  }

  public static getInstance(): KafkaAdapter {
    if (!KafkaAdapter.instance) {
      KafkaAdapter.build();
    }

    return KafkaAdapter.instance;
  }

  async addEvent(event: string, message: string): Promise<void> {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(message);
  }

  async publishEvent(
    event: string,
    retry = 0,
  ): Promise<Either<NotFoundError | BadRequestError, SuccessfulResponse>> {
    await this.producer.connect();

    if (!this.events[event]) return left(new NotFoundError('Event not found'));

    try {
      this.events[event].forEach(async (message, index) => {
        await this.producer.send({
          topic: event,
          messages: [{ value: message }],
        });

        this.events[event].splice(index, 1);
      });
    } catch (error) {
      if (retry >= 1) this.publishEvent(event, retry + 1);

      return left(new BadRequestError('Error publishing event'));
    }

    await this.producer.disconnect();

    return right(new SuccessfulResponse('Event published'));
  }

  async consumeEvent(event: string, callback: (message: string) => void): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: event, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        callback(message.toString());
      },
    });
  }
}
