import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto & { image1?: string; image2?: string }) {
    return this.prisma.project.create({
      data,
    });
  }

  async findAll(page?: number, limit?: number) {
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
  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }
  async update(
    id: number,
    data: UpdateProjectDto & { image1?: string; image2?: string },
  ) {
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (data.image1 && project.image1) {
      const img1Path = path.join(
        process.cwd(),
        'uploads',
        'projects',
        project.image1,
      );

      if (fs.existsSync(img1Path)) {
        fs.unlinkSync(img1Path);
      }
    }

    if (data.image2 && project.image2) {
      const img2Path = path.join(
        process.cwd(),
        'uploads',
        'projects',
        project.image2,
      );

      if (fs.existsSync(img2Path)) {
        fs.unlinkSync(img2Path);
      }
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }
  async delete(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Delete images
    if (project.image1) {
      fs.unlinkSync(path.join('uploads/projects', project.image1));
    }

    if (project.image2) {
      fs.unlinkSync(path.join('uploads/projects', project.image2));
    }

    return this.prisma.project.delete({ where: { id } });
  }
}
