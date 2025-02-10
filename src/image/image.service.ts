import * as sharp from 'sharp';
import { randomUUID } from 'crypto';
import { S3 } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  calculateImageSize,
  validateAspectRatio,
  DimensionMap,
} from './helper';
import { ImageLocation } from './enum';

const ResizeMap: Record<ImageLocation, number> = {
  [ImageLocation.PROFILE]: 200,
};

@Injectable()
export class ImageService {
  readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      region: process.env.S3_REGION,
    });
  }

  async upload(file: Express.Multer.File, location: ImageLocation) {
    if (!validateAspectRatio(calculateImageSize(file.buffer), location))
      throw new BadRequestException(
        `Image does not satisfy ${DimensionMap[location]} : 1 aspect ratio`,
      );

    const Bucket = 'apelance';
    const Body = await sharp(file.buffer)
      .resize(ResizeMap[location])
      .webp({ quality: 80 })
      .toBuffer();
    const Key = `uploads/${randomUUID()}.webp`;

    await this.s3.putObject({ Bucket, Key, Body });
    return { imgUrl: Key };
  }

  async uploadBase64(base64: string, userId: string) {
    const Bucket = 'apelance';
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const key = `uploads/${userId}`;
    const params = {
      Bucket: Bucket,
      Key: key,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: mimeType,
    };

    await this.s3.putObject(params);
    return true;
  }
}
