import { Controller, Get, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('projects')
  getProjects(@Query() query: PaginationDto) {
    return this.publicService.getAllProjects(query.page, query.limit);
  }

  @Get('teams')
  getTeams(@Query() query: PaginationDto) {
    return this.publicService.getAllTeams(query.page, query.limit);
  }
}
