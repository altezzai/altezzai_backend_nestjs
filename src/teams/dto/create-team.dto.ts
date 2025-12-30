import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  designation: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
