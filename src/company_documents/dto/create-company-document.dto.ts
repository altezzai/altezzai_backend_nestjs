import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { DocumentStatus, DocumentType } from '@prisma/client';

export class CreateCompanyDocumentDto {
  @IsString()
  title: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referral_no?: string;

  // file comes from multipart upload, not body validation
  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  relatedTo?: string;

  @IsOptional()
  @IsDateString()
  issuedDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}
