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
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty({ message: `At least one size` })
  sizes: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty({ message: `At least one tag` })
  tags: string[];
}
