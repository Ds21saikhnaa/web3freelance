import { HeightWitdth, ImageLocation } from '../enum';

export const DimensionMap: Record<ImageLocation, number> = {
  [ImageLocation.PROFILE]: 1,
};

export function validateAspectRatio(
  { width, height }: HeightWitdth,
  location: ImageLocation,
) {
  return DimensionMap[location] === width / height;
}

function extractSize(
  buffer: Buffer,
  i: number,
): { height: number; width: number } {
  return {
    height: buffer.readUInt16BE(i),
    width: buffer.readUInt16BE(i + 2),
  };
}

function validateBuffer(buffer: Buffer, i: number): void {
  if (i > buffer.length) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits');
  }
  if (buffer[i] !== 0xff) {
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

export function calculateImageSize(buffer: Buffer): HeightWitdth {
  buffer = buffer.subarray(4);

  let i: number, next: number;
  while (buffer.length) {
    i = buffer.readUInt16BE(0);

    validateBuffer(buffer, i);

    next = buffer[i + 1];
    if (next === 0xc0 || next === 0xc1 || next === 0xc2) {
      return extractSize(buffer, i + 5);
    }

    buffer = buffer.subarray(i + 2);
  }

  throw new TypeError('Invalid JPG, no size found');
}
