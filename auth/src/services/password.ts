
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async Hash(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    try {
      const salt = randomBytes(8).toString('hex');
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      return `${buf.toString('hex')}.${salt}`;
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }
     
  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    try {
      const parts = storedPassword.split('.');
      if (parts.length !== 2) {
        return false;
      }
      const [hashedPassword, salt] = parts;
      if (!salt) {
        return false;
      }
      const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
      const suppliedHash = buf.toString('hex');
      
      if (!hashedPassword || !suppliedHash) {
        return false;
      }
      return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(suppliedHash, 'hex'));
    } catch (error) {
      return false;
    }
  }
}



