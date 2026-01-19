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
    const project = await this.prisma.project.create({
      data,
    });

    // Transform to include full image URLs
    return {
      ...project,
      image1: project.image1 ? `/uploads/projects/${project.image1}` : null,
      image2: project.image2 ? `/uploads/projects/${project.image2}` : null,
    };
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
  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) return null;

    // Transform to include full image URLs
    return {
      ...project,
      image1: project.image1 ? `/uploads/projects/${project.image1}` : null,
      image2: project.image2 ? `/uploads/projects/${project.image2}` : null,
    };
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

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data,
    });

    // Transform to include full image URLs
    return {
      ...updatedProject,
      image1: updatedProject.image1
        ? `/uploads/projects/${updatedProject.image1}`
        : null,
      image2: updatedProject.image2
        ? `/uploads/projects/${updatedProject.image2}`
        : null,
    };
  }
  async delete(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Delete image files if they exist
    if (project.image1) {
      try {
        const img1Path = path.join(
          process.cwd(),
          'uploads',
          'projects',
          project.image1,
        );
        if (fs.existsSync(img1Path)) {
          fs.unlinkSync(img1Path);
        }
      } catch (error) {
        console.error('Error deleting image1 file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    if (project.image2) {
      try {
        const img2Path = path.join(
          process.cwd(),
          'uploads',
          'projects',
          project.image2,
        );
        if (fs.existsSync(img2Path)) {
          fs.unlinkSync(img2Path);
        }
      } catch (error) {
        console.error('Error deleting image2 file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    await this.prisma.project.delete({ where: { id } });

    return { message: 'Project deleted successfully' };
  }
}
