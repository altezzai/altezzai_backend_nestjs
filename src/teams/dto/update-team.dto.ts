import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

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
}
