import { Controller, Post, Get, Param, Body, Put, Delete, Logger } from '@nestjs/common';
import { AcademyService } from './academy.service';

@Controller('academy')
export class AcademyController{
  constructor(
    private readonly academyService : AcademyService,
  ) {}

  @Get('totallist')
  getAcademyList()
  {
    const workbooks = this.academyService.findAll();
    return workbooks;
  }
}