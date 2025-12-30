import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  projectName: string;

  @IsUrl()
  url: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
