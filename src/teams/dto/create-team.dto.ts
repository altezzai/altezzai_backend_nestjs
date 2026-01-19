import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  designation: string;

  @IsOptional()
  linkedin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

@IsOptional()
isPublic?: boolean;

@IsOptional()
isActive?: boolean;
}
