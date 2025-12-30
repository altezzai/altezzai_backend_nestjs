import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects(page?: number, limit?: number) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip =
      pageNumber && limitNumber ? (pageNumber - 1) * limitNumber : undefined;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limitNumber,
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.project.count(),
    ]);

    return {
      meta: limitNumber
        ? {
            total,
            pageNumber,
            limitNumber,
            totalPages: Math.ceil(total / limitNumber),
          }
        : undefined,
      data,
    };
  }

  async getAllTeams(page?: number, limit?: number) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await Promise.all([
      this.prisma.team.findMany({
        skip,
        take: limitNumber, // ✅ number now
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.team.count(),
    ]);

    return {
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      data,
    };
  }
}
