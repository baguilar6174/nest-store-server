import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    default: 10,
    description: `How many rows do you need`,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type((): NumberConstructor => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: `How many rows do you want to skip`,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type((): NumberConstructor => Number)
  @Min(0)
  offset?: number;
}
