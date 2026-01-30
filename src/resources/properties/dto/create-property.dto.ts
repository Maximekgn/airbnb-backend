import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  price: string;

  @IsNumber()
  @Type(() => Number)
  rating: number;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  category: string;

  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSelected?: boolean;

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

  @IsNumber()
  @Type(() => Number)
  parking: number;

  @IsBoolean()
  @Type(() => Boolean)
  wifi: boolean;

  @IsString()
  kitchen: string;

  @IsString()
  ownerId: string;
}
