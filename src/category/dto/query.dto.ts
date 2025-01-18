import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDto {
  @ApiPropertyOptional({
    type: String,
    description: 'If you want to get them all, type "all".',
  })
  parent: string;
}
