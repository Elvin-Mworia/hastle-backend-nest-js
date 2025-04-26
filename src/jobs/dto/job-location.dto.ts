import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, ValidateNested } from 'class-validator';

export enum GeoJSONType {
  Point = 'Point',
}

export class LocationDto {
  @IsEnum(GeoJSONType)
  type: GeoJSONType = GeoJSONType.Point;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number]; // [longitude, latitude]
}

