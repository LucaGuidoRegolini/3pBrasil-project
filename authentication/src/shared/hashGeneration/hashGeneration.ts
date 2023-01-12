import { authConfig } from '@configs/auth';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class HashGeneration {
  public static generateUUID(): string {
    return v4();
  }

  public static async compareHash(password: string, hash: string): Promise<boolean> {
    const result = bcrypt.compare(password, hash);
    return result;
  }

  public static generateToken(data: any): string {
    const token = jwt.sign(data, authConfig.jwt_secret, {
      expiresIn: authConfig.jwt_expiresIn,
    });
    return token;
  }
}
