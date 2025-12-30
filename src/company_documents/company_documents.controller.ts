import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CompanyDocumentsService } from './company_documents.service';
import { CreateCompanyDocumentDto } from './dto/create-company-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-company-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  compressAndSaveFile,
  deleteFile,
} from '../common/utils/file-upload.util';
const uploadPath = 'uploads/company-documents';
@Controller('company-documents')
export class CompanyDocumentsController {
  constructor(private service: CompanyDocumentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateCompanyDocumentDto,
  ) {
    const filename = await compressAndSaveFile(file, uploadPath);
    return this.service.create({
      ...body,
      file: filename,
      issuedDate: body.issuedDate ? new Date(body.issuedDate) : new Date(),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateCompanyDocumentDto,
  ) {
    let filename: string | undefined;
    const document = await this.service.findOne(id);
    if (!document) {
      throw new Error('Document not found');
    }
    if (file) {
      filename = await compressAndSaveFile(file, 'uploads/company-documents');
      if (document.file) {
        // Delete old file

        deleteFile(document.file, uploadPath);
      }
    }

    return this.service.update(id, {
      ...body,
      ...(filename && { file: filename }),
      issuedDate: body.issuedDate ? new Date(body.issuedDate) : undefined,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const document = this.service.findOne(id);
    if (!document) {
      throw new Error('Document not found');
    }

    const result = this.service.remove(id);

    return {
      message: 'Document deleted successfully',
      result,
    };
  }
}
