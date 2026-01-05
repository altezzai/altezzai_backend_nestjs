import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.client.create({ data });
  }

  findAll() {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    
    return this.prisma.client.delete({ where: { id } });
  }
}
