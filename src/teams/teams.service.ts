import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.team.create({ data });
  }

  async findAll(page?: number, limit?: number) {
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
  async findOne(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    const team = await this.prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team member not found');
    }

    // delete old photo if replaced
    if (data.photo && team.photo) {
      fs.unlinkSync(path.join('uploads/teams', team.photo));
    }

    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team member not found');
      return 'Team member not found';
    }

    if (team.photo) {
      fs.unlinkSync(path.join('uploads/teams', team.photo));
    }

    this.prisma.team.delete({ where: { id } });

    return { message: 'Team member deleted successfully' };
  }
}
