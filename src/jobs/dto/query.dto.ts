import { ApiPropertyOptional } from '@nestjs/swagger';
import { DateEnum, PaginationDto } from '../../utils';

export class QueryDto extends PaginationDto {
  @ApiPropertyOptional({ type: String })
  search: string;

  @ApiPropertyOptional({ type: String })
  category: string;

  @ApiPropertyOptional({ type: Number })
  minBudget: number;

  @ApiPropertyOptional({ type: Number })
  maxBudget: number;

  @ApiPropertyOptional({ type: Number })
  duration_time: number;

  @ApiPropertyOptional({ type: String, enum: DateEnum })
  duration_time_type: DateEnum;

  @ApiPropertyOptional({ type: String })
  badge: string;
}
