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
} from '@nestjs/common';
import { ClientsService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { compressAndSaveFile, deleteFile } from '../common/utils/file-upload.util';
const uploadPath = 'uploads/clients';
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateClientDto,
  ) {
    const logo = file
      ? await compressAndSaveFile(file, uploadPath)
      : undefined;

    return this.clientsService.create({
      ...body,
      logo,
    });
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateClientDto,
  ) {
    let logo: string | undefined;
    const client = await this.clientsService.findOne(id);
    if (!client) {
      throw new Error('Client not found');
    }

    if (file) {
      logo = await compressAndSaveFile(file, uploadPath);

      if (client.logo) {
        deleteFile(client.logo, uploadPath);
      }
    }
     

    return this.clientsService.update(id, {
      ...body,
      ...(logo && { logo }),
    });
  }

  @Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number) {
  const client = await this.clientsService.findOne(id);
    if (!client) {
      throw new Error('Client not found');
    }
     if (client.logo) {
       await deleteFile(client.logo, uploadPath);
      }

    const deletedClient = await this.clientsService.remove(id);

  // 4️⃣ Return response
  return {
    message: 'Client deleted successfully',
    data: deletedClient,
  };

  }
}
