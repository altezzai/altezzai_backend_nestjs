import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDocumentsController } from './company_documents.controller';

describe('CompanyDocumentsController', () => {
  let controller: CompanyDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyDocumentsController],
    }).compile();

    controller = module.get<CompanyDocumentsController>(CompanyDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
