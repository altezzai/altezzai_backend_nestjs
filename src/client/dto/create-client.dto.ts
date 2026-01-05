import {  IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;


  @IsOptional()
  @IsString()
  description?: string;
}
