import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const team = await this.prisma.team.create({ data });

    // Transform to include full photo URL
    return {
      ...team,
      photo: team.photo
        ? team.photo.startsWith('/uploads/teams/')
          ? team.photo
          : `/uploads/teams/${team.photo}`
        : null,
    };
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

    // Transform data to include full photo URLs
    const transformedData = data.map((team) => ({
      ...team,
      photo: team.photo
        ? team.photo.startsWith('/uploads/teams/')
          ? team.photo
          : `/uploads/teams/${team.photo}`
        : null,
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
  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) return null;

    // Transform to include full photo URL
    return {
      ...team,
      photo: team.photo
        ? team.photo.startsWith('/uploads/teams/')
          ? team.photo
          : `/uploads/teams/${team.photo}`
        : null,
    };
  }

  async update(id: number, data: any) {
    const team = await this.prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team member not found');
    }

    // delete old photo if replaced with a new one
    if (data.photo && data.photo !== team.photo && team.photo) {
      // Extract filename from full path if it exists
      const oldPhotoFilename = team.photo.startsWith('/uploads/teams/')
        ? team.photo.replace('/uploads/teams/', '')
        : team.photo;

      const oldPhotoPath = path.join('uploads/teams', oldPhotoFilename);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    if (data.photo === null) {
      data.photo = team.photo;
    }
    const updatedTeam = await this.prisma.team.update({
      where: { id },
      data,
    });

    // Transform to include full photo URL
    return {
      ...updatedTeam,
      photo: updatedTeam.photo
        ? updatedTeam.photo.startsWith('/uploads/teams/')
          ? updatedTeam.photo
          : `/uploads/teams/${updatedTeam.photo}`
        : null,
    };
  }

  async delete(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id } });

    if (!team) {
      throw new NotFoundException('Team member not found');
    }

    // Delete photo file if it exists
    if (team.photo) {
      try {
        // Extract filename from full path if it exists
        const photoFilename = team.photo.startsWith('/uploads/teams/')
          ? team.photo.replace('/uploads/teams/', '')
          : team.photo;

        const filePath = path.join(
          process.cwd(),
          'uploads',
          'teams',
          photoFilename,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting photo file:', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    await this.prisma.team.delete({ where: { id } });

    return { message: 'Team member deleted successfully' };
  }
}
