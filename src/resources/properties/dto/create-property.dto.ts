import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  price: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  categoryId: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  bedrooms: number;

  @IsNumber()
  @Type(() => Number)
  bathrooms: number;

  @IsBoolean()
  @Type(() => Boolean)
  garage: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  wifi: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  kitchen: boolean;

  @IsOptional()
  @IsString()
  ownerId: string;

  @IsOptional()
  @IsString()
  image?: string;
}
