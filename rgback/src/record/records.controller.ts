import { Controller, Post, Body } from "@nestjs/common";

import { RecordsService } from './records.service';
import { Academy } from "src/academy/academy.entity";

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('allstudent')
  async getAllAcademyStudent(@Body() academyIds: { academyId: string } )
  {
    return this.recordsService.getAllAcademyStudentRecord(academyIds);
  }

  @Post('onestudent')
  async getOneAcademyStudent(@Body() data: {data: string, academyId: string } )
  {
    return this.recordsService.getOneAcademyStudentRecord(data);
  }
}