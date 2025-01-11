import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    type: Number,
    default: 1,
    minimum: 1,
  })
  page: number;

  @ApiPropertyOptional({
    type: Number,
    default: 10,
    maximum: 30,
  })
  limit: number;
}
