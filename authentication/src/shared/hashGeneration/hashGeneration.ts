import { authConfig } from '@configs/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET;

export class HashGeneration {
  public static async generateHash(password: string): Promise<string> {
    const hash = bcrypt.hash(password, authConfig.saltOrRounds);
    return hash;
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
