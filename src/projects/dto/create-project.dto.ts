import { IsInt, IsOptional, IsString, IsUrl,  } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  projectName: string;

  @IsUrl()
  url: string;

  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;
}
