import { IsInt, IsOptional, IsString, IsUrl, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

// ✅ FIX BOOLEAN TRANSFORMATION
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
