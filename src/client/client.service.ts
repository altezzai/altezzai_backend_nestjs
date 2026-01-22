import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const client = await this.prisma.client.create({ data });

    // Transform to include full logo URL
    return {
      ...client,
      logo: client.logo ? `/uploads/clients/${client.logo}` : null,
    };
  }

  async findAll() {
    const clients = await this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include full logo URLs
    return clients.map((client) => ({
      ...client,
      logo: client.logo ? `/uploads/clients/${client.logo}` : null,
    }));
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');

    // Transform to include full logo URL
    return {
      ...client,
      logo: client.logo ? `/uploads/clients/${client.logo}` : null,
    };
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data,
    });

    // Transform to include full logo URL
    return {
      ...updatedClient,
      logo: updatedClient.logo
        ? `/uploads/clients/${updatedClient.logo}`
        : null,
    };
  }

  async remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}
