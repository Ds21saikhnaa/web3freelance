import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../utils';

export class QueryDto extends PaginationDto {
  @ApiPropertyOptional({ type: String })
  category: string;

  @ApiPropertyOptional({ type: [String] })
  skills: string[];

  @ApiPropertyOptional({ type: Number })
  minBudget: number;

  @ApiPropertyOptional({ type: Number })
  maxBudget: number;

  @ApiPropertyOptional({ type: String })
  badge: string;
}
