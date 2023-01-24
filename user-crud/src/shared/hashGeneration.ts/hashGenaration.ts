import { authConfig } from '@configs/auth';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class HashGeneration {
  public static generateUUID(): string {
    return v4();
  }

  public static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.saltOrRounds);
  }

  public static async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static validJWT(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, authConfig.jwt_secret);
  }
}
