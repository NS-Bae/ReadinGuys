import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Academy } from './Academy.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ Academy ])],
  providers : [ Academy ],
  exports : [ Academy ],
})
export class AcademyModule {};