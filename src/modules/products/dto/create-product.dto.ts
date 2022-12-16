import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: `Product name (unique)`,
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty({ message: `At least one size` })
  sizes: string[];

  @ApiProperty()
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty({ message: `At least one tag` })
  tags: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty({ message: `At least one tag` })
  images?: string[];
}
