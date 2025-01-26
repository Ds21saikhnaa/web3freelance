import * as crypto from 'crypto';
import { Job } from '../jobs/entities/jobs.entity';
import { BadRequestException } from '@nestjs/common';

export function encrypt(
  data: Job,
  secretKey: string = process.env.SECRET_KEY,
): string {
  if (!secretKey) {
    throw new BadRequestException(
      'Secret key is not defined in the environment variables.',
    );
  }

  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const jsonString = JSON.stringify({
    _id: data._id,
    title: data.title,
    description: data.description,
    gig_budget: data.gig_budget,
  });
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(
  encryptedData: string,
  secretKey: string = process.env.SECRET_KEY,
): Job {
  if (!secretKey) {
    throw new Error('Secret key is not defined in the environment variables.');
  }

  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(secretKey).digest();

  const [ivHex, encrypted] = encryptedData.split(':');
  if (!ivHex || !encrypted) {
    throw new BadRequestException('Invalid encrypted data format.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted) as Job;
}
