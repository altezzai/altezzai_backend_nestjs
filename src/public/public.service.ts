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

    // Transform data to include full image URLs
    const transformedData = data.map((project) => ({
      ...project,
      image1: project.image1 ? `/uploads/projects/${project.image1}` : null,
      image2: project.image2 ? `/uploads/projects/${project.image2}` : null,
    }));

    return {
      meta: limitNumber
        ? {
            total,
            pageNumber,
            limitNumber,
            totalPages: Math.ceil(total / limitNumber),
          }
        : undefined,
      data: transformedData,
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

    // Transform data to include full photo URLs
    const transformedData = data.map((team) => ({
      ...team,
      photo: team.photo ? `/uploads/teams/${team.photo}` : null,
    }));

    return {
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      data: transformedData,
    };
  }
}
