import { Buffer } from 'buffer';
import * as crypto from 'crypto';

export function generateInitVector(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function encryptData(
  data: string,
  key: string,
  iv: string,
): string {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');

  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const encryptedData =
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

  return encryptedData;
}

export function decryptData(
  encryptedData: string,
  key: string,
  iv: string,
): string {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const decryptedData =
    decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8');

  return decryptedData;
}

