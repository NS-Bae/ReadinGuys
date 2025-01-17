import { Controller, Query, Get, Res, Body, Post, BadRequestException } from '@nestjs/common';
import { WorkbookService } from './workbooks.service';
import { Response } from 'express';

@Controller('workbook')
export class WorkbookController {
  constructor(
    private readonly workbookService: WorkbookService,
  ) {}

  @Get('list')
  async getWorkbookList(@Query('academyId') academyId: string)
  {
    const workbooks = await this.workbookService.getWorkbookList(academyId);
    return workbooks;
  }

  @Post('download')
  async downloadBook(@Body('storageLink') storageLink : string, @Res() res : Response)
  {
    if(!storageLink)
    {
      throw new BadRequestException('파일경로가 존재하지 않습니다.');
    }
    const bookLink = await this.workbookService.getWorkbookDownload(storageLink);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(storageLink)}"`);
    res.sendFile(bookLink);
  }
}