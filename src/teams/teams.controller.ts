import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { compressAndSaveFile } from '../common/utils/file-upload.util';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    // ✅ ADD async HERE
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateTeamDto,
  ) {
    let filename: string | undefined;

    if (file) {
      filename = await compressAndSaveFile(file, 'uploads/teams');
    }

    return this.teamsService.create({
      name: body.name,
      designation: body.designation,
      linkedin: body.linkedin,
      priority: body.priority ? Number(body.priority) : 0,
      photo: filename,
    });
  }

  @Get() findAll(@Query() query: PaginationDto) {
    return this.teamsService.findAll(query.page, query.limit);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    // ✅ ADD async HERE
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateTeamDto,
  ) {
    const team = await this.teamsService.findOne(id);
    if (!team) {
      throw new Error('Team member not found');
    }

    let filename: string | undefined;

    if (file) {
      filename = await compressAndSaveFile(file, 'uploads/teams');
    }

    // Extract just the filename from the full path if no new file uploaded
    let photoToSave = filename;
    if (!filename && team.photo) {
      // Remove the /uploads/teams/ prefix to get just the filename
      photoToSave = team.photo.startsWith('/uploads/teams/')
        ? team.photo.replace('/uploads/teams/', '')
        : team.photo;
    }

    return this.teamsService.update(id, {
      name: body.name,
      designation: body.designation,
      linkedin: body.linkedin,
      priority: body.priority ? Number(body.priority) : 0,
      photo: photoToSave,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.delete(id);
  }
}
