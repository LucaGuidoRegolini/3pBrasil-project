import { authConfig } from '@configs/auth';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

export class HashGeneration {
  public static generateUUID(): string {
    return v4();
  }

  public static async generateHash(password: string): Promise<string> {
    const hash = bcrypt.hash(password, authConfig.saltOrRounds);
    return hash;
  }

  public static async compareHash(password: string, hash: string): Promise<boolean> {
    const result = bcrypt.compare(password, hash);
    return result;
  }
}
