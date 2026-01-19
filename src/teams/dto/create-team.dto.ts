import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  designation: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @IsOptional()
  is_public?: boolean;
  @IsOptional()
  is_active?: boolean;
}
