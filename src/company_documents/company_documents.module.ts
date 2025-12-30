import { Module } from '@nestjs/common';
import { CompanyDocumentsController } from './company_documents.controller';
import { CompanyDocumentsService } from './company_documents.service';

@Module({
  controllers: [CompanyDocumentsController],
  providers: [CompanyDocumentsService],
})
export class CompanyDocumentsModule {}
