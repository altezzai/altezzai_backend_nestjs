import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateProjectDto } from './dto/update-project.dto';
import { memoryStorage } from 'multer';
import { compressAndSaveFile , deleteFile} from '../common/utils/file-upload.util';
import { PaginationDto } from '../common/dto/pagination.dto';
const uploadPath = 'uploads/projects';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
    },
    @Body() body: CreateProjectDto, // 👈 important
  ) {

    let image1: string | undefined;
    let image2: string | undefined;

    if (files?.image1?.[0]) {
      image1 = await compressAndSaveFile(files.image1[0], uploadPath);
      console.log('Image1 saved:', image1);
    }

    if (files?.image2?.[0]) {
      image2 = await compressAndSaveFile(files.image2[0], uploadPath);
      console.log('Image2 saved:', image2);
    }

    return this.projectsService.create({
      projectName: body.projectName,
      url: body.url,
      description: body.description,
      priority: body.priority ? Number(body.priority) : 0, // ✅ FIX
      image1: image1,
      image2: image2,
    });
  }
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.projectsService.findAll(query.page, query.limit);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
    },
    @Body() body: UpdateProjectDto,
  ) {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    let image1: string | undefined;
    let image2: string | undefined;

    if (files && files.image1 && files.image1[0]) {
      image1 = await compressAndSaveFile(files.image1[0], uploadPath);
      if (project.image1) {
        deleteFile(project.image1, uploadPath);
      }
    }

    if (files && files.image2 && files.image2[0]) {
      image2 = await compressAndSaveFile(files.image2[0], uploadPath);
      if (project.image2) {
        deleteFile(project.image2, uploadPath);
      }
    }

    return this.projectsService.update(id, {
      projectName: body.projectName,
      url: body.url,
      description: body.description,
      priority: body.priority ? Number(body.priority) : 0,
      image1,
      image2,
    });
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const result = this.projectsService.delete(id);
    return { message: 'Project deleted successfully', result };
  }
}
