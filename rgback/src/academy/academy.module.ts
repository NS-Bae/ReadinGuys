import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Academy } from './academy.entity';
import { AcademyService } from './academy.service';
import { AcademyController } from './academy.controller';

@Module({
  imports : [TypeOrmModule.forFeature([ Academy ])],
  providers : [ AcademyService ],
  controllers : [ AcademyController ],
})
export class AcademyModule {};