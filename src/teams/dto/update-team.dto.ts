import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

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
  @IsInt()
  priority?: number;

  @IsOptional()
  is_public?: boolean;
  
  @IsOptional()
  is_active?: boolean;
}
