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
}
