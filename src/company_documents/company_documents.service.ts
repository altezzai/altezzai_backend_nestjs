import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { deleteFile } from '../common/utils/file-upload.util';

@Injectable()
export class CompanyDocumentsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.companyDocument.create({ data });
  }

  findAll() {
    return this.prisma.companyDocument.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.companyDocument.findFirst({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    const doc = await this.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');

    return this.prisma.companyDocument.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const doc = await this.findOne(id);
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.file) {
      deleteFile(doc.file, 'uploads/company-documents');
    }

    return this.prisma.companyDocument.delete({ where: { id } });
  }
}
